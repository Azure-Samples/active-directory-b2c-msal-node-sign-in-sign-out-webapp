/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const {engine}  = require('express-handlebars');
const msal = require('@azure/msal-node');
const axios = require('axios');
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

// Current web API coordinates were pre-registered in a B2C tenant.
const apiConfig = {
    webApiScopes: [`https://${process.env.TENANT_NAME}.onmicrosoft.com/tasks-api/tasks.read`],
    anonymous: 'http://localhost:5000/public',
    protected: 'http://localhost:5000/hello'
};

/**
 * The MSAL.js library allows you to pass your custom state as state parameter in the Request object
 * By default, MSAL.js passes a randomly generated unique state parameter value in the authentication requests.
 * The state parameter can also be used to encode information of the app's state before redirect. 
 * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
 * For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request
 */
const APP_STATES = {
    LOGIN: 'login',
    CALL_API:'call_api'   
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


// Initialize MSAL Node
const confidentialClientApplication = new msal.ConfidentialClientApplication(confidentialClientConfig);

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
//Create an express instance
const app = express();

//Set handlebars as your view engine
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set("views", "./views");

app.use(session(sessionConfig));

/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from 
 * @param {array} scopes: scopes to request the auth code for 
 * @param {string} state: state of the application, tag a request
 * @param {Object} res: express middleware response object
 */

 const getAuthCode = (authority, scopes, state, res) => {
    // prepare the request
    console.log("Fetching Authorization code")
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;

    //Each time you fetch Authorization code, update the authority in the tokenRequest configuration
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

app.get('/', (req, res) => {
    res.render('signin', { showSignInButton: true });
});



app.get('/signin',(req, res)=>{ 
        //Initiate a Auth Code Flow >> for sign in
        //Pass the api scopes as well so that you received both the IdToken and accessToken
        getAuthCode(process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY,apiConfig.webApiScopes, APP_STATES.LOGIN, res);
});


app.get('/redirect',(req, res)=>{    
    
    if (req.query.state === APP_STATES.LOGIN) {
        // prepare the request for calling the web API
        tokenRequest.authority = process.env.SIGN_UP_SIGN_IN_POLICY_AUTHORITY;
        tokenRequest.scopes = apiConfig.webApiScopes;
        tokenRequest.code = req.query.code;
        confidentialClientApplication.acquireTokenByCode(tokenRequest)
        .then((response) => {
            req.session.accessToken = response.accessToken;
            req.session.givenName = response.idTokenClaims.given_name;
            console.log('\nAccessToken:' + req.session.accessToken);
            res.render('signin', {showSignInButton: false, givenName: response.idTokenClaims.given_name});
        }).catch((error) => {
            console.log(error);
            res.status(500).send(error);
        });
    }else{
        res.status(500).send('We do not recognize this response!');
    }
});

app.get('/api', async (req, res) => {
    if(!req.session.accessToken){
        //User is not logged in and so they can only call the anonymous API
        try {
            const response = await axios.get(apiConfig.anonymous);
            console.log('API response' + response.data); 
            res.render('api',{data: JSON.stringify(response.data), showSignInButton: true, bg_color:'warning'});
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }         
    }else{
        //Users have the accessToken because they signed in and the accessToken is still in the session
        console.log('\nAccessToken:' + req.session.accessToken);
        let accessToken = req.session.accessToken;
        const options = {
            headers: {
                //accessToken used as bearer token to call a protected API
                Authorization: `Bearer ${accessToken}`
            }
        };

        try {
            const response = await axios.get(apiConfig.protected, options);
            console.log('API response' + response.data); 
            res.render('api',{data: JSON.stringify(response.data), showSignInButton: false, bg_color:'success', givenName: req.session.givenName});
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }     
});

/**
 * Sign out end point
*/
app.get('/signout',async (req, res)=>{    
    logoutUri = process.env.LOGOUT_ENDPOINT;
    req.session.destroy(() => {
        res.redirect(logoutUri);
    });
});
app.listen(process.env.SERVER_PORT, () => console.log(`Msal Node Auth Code Sample app listening on port !` + process.env.SERVER_PORT));