---
page_type: sample
languages:
- javascript
products:
- msal-node
- azure-active-directory-b2c
- microsoft-identity-platform
description: "Enable authentication in your own Node web application using Azure AD B2C"
urlFragment: "active-directory-b2c-msal-node-sign-in-sign-out-webapp"
---

# Enable authentication in your own Node web application and web API using Azure AD B2C  

This sample web app uses Azure Active Directory B2C (Azure AD B2C) user flows and the [Microsoft Authentication Library for JavaScript (msal-node)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) to enable authentication in your own Node.js web application and API.   

### Repository Structure and Contents    

The code within this repo consists of two main parts:

1.  The `index.js` file in the root folder enables initial authentication and handles the following endpoints and scenarios:    
    -  `/`:  renders a signin page    
    -  `/signin`:  initiates an Auth Code flow for user signin   
    -  `/password`:  handles call to reset password   
    -  `/profile`:  handles call to edit profile    
    -  `/signout`:  destroys the session that contains the `accessToken` and notifies B2C using the logout uri     
    -  `/redirect`:  handles redirect scenarios for signin, password reset and edit profile actions       

2.  The `call-protected-api` folder provides an example of how to extend B2C authentication to endpoints in your Node application. 

### Which code to use    

If you just want to enable basic authentication (signin, signout, edit-profile, reset password etc), you only need to refer to the first part.  

If you want to implement both basic authentication and API authentication, you will need to implement the logic from both of these parts.  

### MSAL Reference 

The official reference documentation for msal-node is here:  

https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html  

It describes the classes and methods that are used in this repo, for example:

 - [Class ConfidentialClientApplication](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html)   
 - [Method getAuthCodeUrl](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html#getauthcodeurl)  
 - [Method acquireTokenByCode](https://azuread.github.io/microsoft-authentication-library-for-js/ref/classes/_azure_msal_node.confidentialclientapplication.html#acquiretokenbycode)   
  
### Microsoft Learn    

The official documentation for Azure AD B2C starts here:

https://learn.microsoft.com/en-us/azure/active-directory-b2c/overview  

The first `Tutorial` walks you through creating an Azure AD B2C Tenant:

https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant

The `Samples` section provide links to application samples including iOS, Android, .NET, and Node.js:

https://learn.microsoft.com/en-us/azure/active-directory-b2c/integrate-with-app-code-samples  

Node.js specific content is located in a few different sections.  

These two articles sit in the `How-to guides` > `Integrate apps` > `Web App` > `Node.js` section:  

1.  This article provides start to finish instructions for how to implement this sample repository:   

    https://learn.microsoft.com/en-us/azure/active-directory-b2c/configure-a-sample-node-web-app   

2.  This article walks you through creating your own app from scratch, using the same code from this sample repository as an example:  

    https://docs.microsoft.com/azure/active-directory-b2c/enable-authentication-in-node-web-app  

The two articles below sit in the `How-to guides` > `Integrate apps` > `Web API` > `Node.js web app that calls a web API` section.      

They follow the same structure as the above articles but focus on calling an API that is separate from your main Node app:   

1.  https://docs.microsoft.com/azure/active-directory-b2c/configure-authentication-in-sample-node-web-app-with-api    

2.  https://docs.microsoft.com/azure/active-directory-b2c/enable-authentication-in-node-web-app-with-api      


### Related Reading  

The following resources are helpful in understanding topics related to the concepts that are demonstrated in this repository:

**OAuth 2 Simplified**  
https://aaronparecki.com/oauth-2-simplified  

**Azure AD App Registrations, Enterprise Apps and Service Principals (Video)**    
https://www.youtube.com/watch?v=WVNvoiA_ktw  


