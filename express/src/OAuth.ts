import { Client, Issuer, TokenSet } from "openid-client";
import { User } from "./models/User";
import { Request } from "express";

export class OAuth {
  static client: Client;

  public static async init() {
    const oauthIssuer = await Issuer.discover(
      process.env.AUTH0_ISSUER_BASE_URL as string,
    );
    OAuth.client = new oauthIssuer.Client({
      client_id: process.env.AUTH0_CLIENT_ID as string,
      client_secret: process.env.AUTH0_CLIENT_SECRET as string,
      redirect_uris: [process.env.AUTH0_CALLBACK_URL as string],
      response_types: ["code"],
      id_token_signed_response_alg: "HS256",
    });
  }

  public static getAuthorizationUrl(code_challenge: string) {
    return OAuth.client.authorizationUrl({
      scope: "openid profile email offline_access",
      resource: "accounts",
      code_challenge_method: "S256",
      code_challenge,
      redirect_uri: "http://localhost:3000/callback",
    });
  }

  private static saveUserToken(user: User, tokenSet: TokenSet) {
    user.requestFinanceData.refreshToken ??= tokenSet.refresh_token;
    user.requestFinanceData.accessToken = tokenSet.access_token;
    user.requestFinanceData.accessTokenExpires = tokenSet.expires_at;
    user.requestFinanceData.tokenClaims = tokenSet.claims();
  }

  public static async handleCallback(req: Request) {
    const params = OAuth.client.callbackParams(req);
    const tokenSet = await OAuth.client.callback(
      process.env.AUTH0_CALLBACK_URL as string,
      params,
      // verify the received code against the one saved in the database
      { code_verifier: req.user.requestFinanceData.oauthCodeVerifier },
    );
    // save the access token for later
    OAuth.saveUserToken(req.user, tokenSet);
    // forget the code verifier, it is not needed anymore
    req.user.requestFinanceData.oauthCodeVerifier = undefined;
  }

  public static async refreshToken(user: User) {
    if (!user.requestFinanceData.refreshToken) {
      throw new Error("Missing refresh token");
    }
    const tokenSet = await OAuth.client.refresh(
      user.requestFinanceData.refreshToken,
    );
    OAuth.saveUserToken(user, tokenSet);
  }

  public static async refreshTokenIfNeeded(user: User) {
    if (!user.requestFinanceData.refreshToken) {
      throw new Error("Missing refresh token");
    }
    // refresh the access token if it has expired or will expire in less than 60s
    if (
      !user.requestFinanceData.accessToken ||
      !user.requestFinanceData.accessTokenExpires ||
      user.requestFinanceData.accessTokenExpires - 60 <=
        new Date().getTime() / 1000
    ) {
      await OAuth.refreshToken(user);
    }
  }
}
