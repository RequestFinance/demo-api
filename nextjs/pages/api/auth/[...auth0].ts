import { handleAuth, handleLogin, HandlerError } from "@auth0/nextjs-auth0";

export default handleAuth({
  async login(req, res) {
    try {
      await handleLogin(req, res, {
        authorizationParams: {
          scope: "openid profile email offline_access",
        },
      });
    } catch (error) {
      if (error instanceof HandlerError) {
        res.status(error.status || 400).end(error.message);
        return;
      }
      res.status(500);
    }
  },
});
