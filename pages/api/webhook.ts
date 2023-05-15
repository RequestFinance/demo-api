import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import assert from "assert";

const webhookSecret = process.env.WEBHOOK_SECRET;

const isValidSignature = (sig: string, body: any, secret: string) => {
  const strBody = JSON.stringify(body);
  const hash = crypto
    .createHmac("sha256", secret)
    .update(strBody)
    .digest("hex");
  return hash === sig;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  assert(webhookSecret, "Missing WEBHOOK_SECRET env variable");
  const signature = String(req.headers["x-webhook-signature"]);
  if (req.method !== "POST") {
    res.status(405).json({});
    return;
  }
  if (!signature) {
    res.status(400).json({ error: "missing X-Webhook-Signature header" });
    return;
  }

  if (!isValidSignature(signature, req.body, webhookSecret)) {
    res.status(401).json({ error: "invalid signature" });
  }

  res.status(200).json({});
}
