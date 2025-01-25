import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { prettyJSON } from "hono/pretty-json";
import receipts from "./routes/receipts.js";
import config from "./config";
import logger from "./logger";
import requestLogger from "./middleware/requestLogger";

const app = new OpenAPIHono();
app.use(prettyJSON());
app.use(requestLogger(logger));
app.route("/", receipts);
app.doc31("/openapi.json", (c) => ({
  openapi: "3.1.0",
  info: {
    title: "Receipt Processor API",
    version: "1.0.0",
    description: "Calculate points for uploaded receipts.",
    servers: [{ url: new URL(c.req.url).origin }],
  },
}));
app.get(
  "/",
  apiReference({
    pageTitle: "Receipt Processor API",
    spec: {
      url: "/openapi.json",
    },
  }),
);

// noinspection JSUnusedGlobalSymbols -- Required for @hono/vite-build/node
export default app;

if (config.nodeEnv === "production") {
  logger.info("Application listening on port 3000");
}
