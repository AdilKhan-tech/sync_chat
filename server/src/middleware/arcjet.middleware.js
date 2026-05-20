import aj from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";
import { ENV } from "../lib/env.js";

export const arcjetProtection = async (req, res, next) => {
  try {
    if (ENV.NODE_ENV !== "production") {
      return next();
    }

    const userAgent = req.headers["user-agent"] || "";

    if (userAgent.includes("Postman") || userAgent.includes("curl")) {
      return next();
    }

    const decision = await aj.protect(req);

    if (decision.isDenied()) {
      if (decision.reason?.isRateLimit?.()) {
        return res.status(429).json({ error: "Rate limit exceeded" });
      }

      return res.status(403).json({
        error: "Access denied by security policy",
      });
    }

    if (decision.results?.some(isSpoofedBot)) {
      return res.status(403).json({
        error: "Spoofed bot access denied",
      });
    }

    next();
  } catch (error) {
    console.log("ArcJet error:", error);

    next();
  }
};
