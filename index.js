/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
 //<ms_docref_use_app_dependencies>
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const {engine}  = require('express-handlebars');
const msal = require('@azure/msal-node');
//</ms_docref_use_app_dependencies>

//<ms_docref_configure-msal>
/**
 * Confidential Client Application Configuration
 */
 const confidentialClientConfig = {
    auth: {
        clientId: process.env.APP_CLIENT_ID, 
        authority: process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, 
        clientSecret: process.env.APP_CLIENT_SECRET,
        knownAuthorities: [process.env.AUTHORITY_DOMAIN], //This must be an array
        redirectUri: process.env.APP_REDIRECT_URI,
        validateAuthority: false
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};

// Initialize MSAL Node
const confidentialClientApplication = new msal.ConfidentialClientApplication(confidentialClientConfig);
//</ms_docref_configure-msal>

//<ms_docref_global_variable>
/**
 * The MSAL.js library allows you to pass your custom state as state parameter in the Request object
 * By default, MSAL.js passes a randomly generated unique state parameter value in the authentication requests.
 * The state parameter can also be used to encode information of the app's state before redirect. 
 * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
 * For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request
 * In this scenario, the states also serve to show the action that was requested of B2C since only one redirect URL is possible. 
 */

const APP_STATES = {
    LOGIN: 'login',
    LOGOUT: 'logout',
    PASSWORD_RESET: 'password_reset',
    EDIT_PROFILE : 'update_profile'
}


/** 
 * Request Configuration
 * We manipulate these two request objects below 
 * to acquire a token with the appropriate claims.
 */
 const authCodeRequest = {
    redirectUri: confidentialClientConfig.auth.redirectUri,
};

const tokenRequest = {
    redirectUri: confidentialClientConfig.auth.redirectUri,
};

/**
 * Using express-session middleware. Be sure to familiarize yourself with available options
 * and set them as desired. Visit: https://www.npmjs.com/package/express-session
 */
 const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // set this to true on production
    }
}

//</ms_docref_global_variable>

//<ms_docref_view_tepmplate_engine>
 
//Create an express instance
const app = express();

//Set handlebars as your view engine
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set("views", "./views");

//usse session configuration 
app.use(session(sessionConfig));

//</ms_docref_view_tepmplate_engine>

//<ms_docref_authorization_code_url>

/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from 
 * @param {array} scopes: scopes to request the auth code for 
 * @param {string} state: state of the application
 * @param {Object} res: express middleware response object
 */
 const getAuthCode = (authority, scopes, state, res) => {

    // prepare the request
    console.log("Fetching Authorization code")
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;

    //Each time you fetch Authorization code, update the relevant authority in the tokenRequest configuration
    tokenRequest.authority = authority;

    // request an authorization code to exchange for a token
    return confidentialClientApplication.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
            console.log("\nAuthCodeURL: \n" + response);
            //redirect to the auth code URL/send code to 
            res.redirect(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}
 
 //</ms_docref_authorization_code_url>

 
 //<ms_docref_app_endpoints>
 app.get('/', (req, res) => {
    res.render('signin', { showSignInButton: true });
});

app.get('/signin',(req, res)=>{
        //Initiate a Auth Code Flow >> for sign in
        //no scopes passed. openid, profile and offline_access will be used by default.
        getAuthCode(process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY, [], APP_STATES.LOGIN, res);
});

/**
 * Change password end point
*/
app.get('/password',(req, res)=>{
    getAuthCode(process.env.RESET_PASSWORD_POLICY_AUTHORITY, [], APP_STATES.PASSWORD_RESET, res); 
});

/**
 * Edit profile end point
*/
app.get('/profile',(req, res)=>{
    getAuthCode(process.env.EDIT_PROFILE_POLICY_AUTHORITY, [], APP_STATES.EDIT_PROFILE, res); 
});

/**
 * Sign out end point
*/
app.get('/signout',async (req, res)=>{    
    logoutUri = process.env.LOGOUT_ENDPOINT;
    req.session.destroy(() => {
        //When session destruction succeeds, notify B2C service using the logout uri.
        res.redirect(logoutUri);
    });
});

app.get('/redirect',(req, res)=>{
    
    //determine the reason why the request was sent by checking the state
    if (req.query.state === APP_STATES.LOGIN) {
        //prepare the request for authentication        
        tokenRequest.code = req.query.code;
        confidentialClientApplication.acquireTokenByCode(tokenRequest).then((response)=>{
        
        req.session.sessionParams = {user: response.account, idToken: response.idToken};
        console.log("\nAuthToken: \n" + JSON.stringify(response));
        res.render('signin',{showSignInButton: false, givenName: response.account.idTokenClaims.given_name});
        }).catch((error)=>{
            console.log("\nErrorAtLogin: \n" + error);
        });
    }else if (req.query.state === APP_STATES.PASSWORD_RESET) {
        //If the query string has a error param
        if (req.query.error) {
            //and if the error_description contains AADB2C90091 error code
            //Means user selected the Cancel button on the password reset experience 
            if (JSON.stringify(req.query.error_description).includes('AADB2C90091')) {
                //Send the user home with some message
                //But always check if your session still exists
                res.render('signin', {showSignInButton: false, givenName: req.session.sessionParams.user.idTokenClaims.given_name, message: 'User has cancelled the operation'});
            }
        }else{
            
            res.render('signin', {showSignInButton: false, givenName: req.session.sessionParams.user.idTokenClaims.given_name});
        }        
        
    }else if (req.query.state === APP_STATES.EDIT_PROFILE){
    
        tokenRequest.scopes = [];
        tokenRequest.code = req.query.code;
        
        //Request token with claims, including the name that was updated.
        confidentialClientApplication.acquireTokenByCode(tokenRequest).then((response)=>{
            req.session.sessionParams = {user: response.account, idToken: response.idToken};
            console.log("\AuthToken: \n" + JSON.stringify(response));
            res.render('signin',{showSignInButton: false, givenName: response.account.idTokenClaims.given_name});
        }).catch((error)=>{
            //Handle error
        });
    }else{
        res.status(500).send('We do not recognize this response!');
    }

});

 //</ms_docref_app_endpoints>
//start app server to listen on set port
 //<ms_docref_start_node_server>
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Msal Node Auth Code Sample app listening on port !` + process.env.SERVER_PORT);
});
//</ms_docref_start_node_server>
