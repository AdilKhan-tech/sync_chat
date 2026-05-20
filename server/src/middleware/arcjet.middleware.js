import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

export const arcjetProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req);
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      } else if (decision.isBot()) {
        return res.status(403).json({ error: "Bot access denied" });
      } else {
        return res
          .status(403)
          .json({ error: "Access denied by security policy" });
      }
    }
    if (decision.results.some(isSpoofedBot)) {
      return res.status(403).json({ error: "Spoofed bot access denied" });
    }
    next();
  } catch (error) {
    console.log("ArcJet error:", error);
    return next();
  }
};
