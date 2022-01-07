---
page_type: sample
languages:
- javascript
products:
- msal-node
- azure-active-directory-b2c
- microsoft-identity-platform
description: "Tutorial: Sign in and sign out users, update profile, and reset password with Azure AD B2C in a Node.js web app"
urlFragment: "active-directory-b2c-msal-node-sign-in-sign-out-webapp"
---

# Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app

This sample web app uses Azure Active Directory B2C (Azure AD B2C) user flows and the [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) (msal-node) to enable users use their local accounts to:

- Sign in
- Sign out
- Update a profile
- Reset a password
- Optional: allow users to authenticate using their Google account.

Follow the steps in [Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-authenticate-nodejs-web-app-msal#create-azure-ad-b2c-user-flows) to:

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

1. From your shell or command line, run the following command to start your web app:

    ```powershell
    node index.js
    ```

1. In your browser, go to `http://localhost:3000` to access the web app.

> [NOTE]
> This sample comes with a pre-registered application and user flows for testing purposes. If you would like to use your own Azure AD B2C tenant, application, user flows, follow [Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-authenticate-nodejs-web-app-msal#create-azure-ad-b2c-user-flows) to register and configure them in the Azure Portal. Besides, you should ignore the `.env` file because it has information that changes from one environment to another.

## Demo

Learn [how to test your node web app](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-authenticate-nodejs-web-app-msal#test-your-web-app)

## Resources

Use [Tutorial: Sign in and sign out users with Azure AD B2C in a Node.js web app](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-authenticate-nodejs-web-app-msal#create-azure-ad-b2c-user-flows) to understand this app sample better.
