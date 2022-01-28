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

# Enable authentication in your own Node web application using Azure AD B2C

This sample web app uses Azure Active Directory B2C (Azure AD B2C) user flows and the [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) (msal-node) to enable users use their local accounts to:

- Sign in
- Sign out
- Update a profile
- Reset a password
- Optional: enable users to authenticate using their Google account.

Follow the steps in [Enable authentication in your own Node web application using Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/enable-authentication-in-node-web-app) to:

- Register the application in the Azure portal.
- Create user flows for the app in the Azure portal.
- Create a node web app project that uses the [Handlebars view template engine](https://handlebarsjs.com/).
- Install the MSAL-node library and other necessary node packages.
- Add code for user sign-in, sign-out, profile editing, and password reset.
- Test the app.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/).
- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

### Quickstart

1. From your shell or command line, run the following command to clone the repository:

    ```powershell
    git clone https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp.git
    ``` 
    > [warning]
    > Given that the name of the sample is quite long, and so are the names of the referenced packages, you might want to clone it in a folder close to the root of your hard drive, to avoid maximum file path length limitations on Windows Operating System.
1. From your shell or command line, run the following command to install project dependencies:
    
    ```powershell
    cd active-directory-b2c-msal-node-sign-in-sign-out-webapp
    npm install
    ```
1. Update the `.env` file as explained in [Get and update the sample Node web app code](https://docs.microsoft.com/azure/active-directory-b2c/configure-a-sample-node-web-app#get-and-update-the-sample-node-web-app-code)

1. From your shell or command line, run the following command to start your web app:

    ```powershell
    node index.js
    ```

1. In your browser, go to `http://localhost:3000` to access the web app.

## Demo

Learn [how to test your node web app](https://docs.microsoft.com/azure/active-directory-b2c/configure-a-sample-node-web-app#run-your-web-app)

## Resources

Use [Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app](https://docs.microsoft.com/azure/active-directory-b2c/enable-authentication-in-node-web-app) to understand this app sample better.
