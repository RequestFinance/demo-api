import express, { NextFunction, Request, Response } from "express";
import { config } from "dotenv-flow";
import { usersDatabase } from "./database/users";
import { generators } from "openid-client";
import { OAuth } from "./OAuth";
import axios from "axios";

// load environment variables
config();

const bootstrap = async () => {
  // init the OAuth client
  await OAuth.init();

  const app = express();
  const port = 3000;

  // simulate retrieving the user from the Database
  app.use("*", (req: Request, res: Response, next: NextFunction) => {
    req.user = usersDatabase[1];
    next();
  });

  app.get("/", (req: Request, res: Response) => {
    const userJson = JSON.stringify(req.user, null, 2);
    res.send(
      `Hello user: <pre>${userJson}</pre>` +
        (req.user.requestFinanceData.refreshToken
          ? `<a href="/refresh">Refresh your token</a><br>`
          : `<a href="/login">Connect your Request account</a><br>`) +
        (req.user.requestFinanceData.accessToken
          ? `<a href="/invoices">Fetch your invoices</a><br>`
          : ""),
    );
  });

  app.get("/login", async (req: Request, res: Response) => {
    const code_verifier = generators.codeVerifier();
    const code_challenge = generators.codeChallenge(code_verifier);
    // save code verifier for later (in the database, or in a session)
    req.user.requestFinanceData.oauthCodeVerifier = code_verifier;
    // generate the authorization URL
    const url = OAuth.getAuthorizationUrl(code_challenge);
    // redirect the user to the authorization URL
    res.redirect(302, url);
  });

  app.get("/callback", async (req: Request, res: Response) => {
    await OAuth.handleCallback(req);
    res.redirect(302, "/");
  });

  app.get("/refresh", async (req: Request, res: Response) => {
    if (!req.user.requestFinanceData.refreshToken) {
      return res.send(
        `You are not authenticated with Request <a href="/">Return Home</a>`,
      );
    }
    await OAuth.refreshToken(req.user);
    res.redirect(302, "/");
  });

  app.get("/invoices", async (req: Request, res: Response) => {
    if (!req.user.requestFinanceData.refreshToken) {
      return res.send(
        `You are not authenticated with Request <a href="/">Return Home</a>`,
      );
    }
    await OAuth.refreshTokenIfNeeded(req.user);
    const { data: invoices } = await axios.get(
      "https://api.request.finance/invoices",
      {
        headers: {
          Authorization: `Bearer ${req.user.requestFinanceData.accessToken}`,
          "X-Network": "test",
        },
      },
    );
    res.send(`<pre>${JSON.stringify(invoices, null, 2)}</pre>`);
  });

  app.listen(port, () => {
    console.log(`Demo app listening on port ${port}`);
  });
};

void bootstrap();
