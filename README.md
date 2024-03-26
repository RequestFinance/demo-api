# Request Finance API Demo


This repository shows the basics to integrate the Request Finance API.
It provides two examples, one with Express, another one with NextJS.

## Getting Started 
### Create a Request Finance account
If you don't have an account yet, go to https://app.request.finance/signup?redirect=/account/apps. 
Go to https://app.request.finance/account/apps and create an application. 

For both Redirect and Logout URLs, set:
- http://localhost:3000/callback if you're following the Express.js demo
- http://localhost:3000/api/auth/callback if you're following the Next.js demo

## OAuth Configuration
You need to implement an [Authorization Code Flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow).

```
URL: https://auth.request.finance
Audience: accounts
Scope: openid profile email # and optionally, offline_access
```

The `/authorize` will enable you to get a code for your user, that you can convert to a token using the `/oauth/token` endpoint

