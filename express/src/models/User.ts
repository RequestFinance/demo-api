import { IdTokenClaims } from "openid-client";

export class User {
  constructor(id: string, firstname: string, lastname: string) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.requestFinanceData = {};
  }

  // example user ID
  id: string;
  // example user firstname
  firstname: string;
  // example user firstname
  lastname: string;

  // Request Finance data
  requestFinanceData: {
    // needed during authentication against Request Finance (between the login and the verification of login)
    oauthCodeVerifier?: string;
    // the refresh token should be stored safely (in the database, encrypted if possible)
    refreshToken?: string;
    // the access token should be stored in a cache until it expires (in the database, or in Redis, or in memory)
    accessToken?: string;
    // this is the timestamp at which the access token will expire
    accessTokenExpires?: number;
    // this is the result of the decoded ID token (a JWT that contains info about the Request Finance user and permissions)
    tokenClaims?: IdTokenClaims;
  };
}
