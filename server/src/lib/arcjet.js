import { ENV } from "./env.js";
import arcjet, { detectBot, shield, slidingWindow } from "@arcjet/node";

const aj = arcjet({

  key: ENV.ARCJET_KEY,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    slidingWindow({
      mode: "LIVE",
      max: 100,
      interval: 60,
    }),
  ],

});

export default aj;