import type { MiddlewareHandler } from "hono";
import { getPath } from "hono/utils/url";
import ms from "ms";

interface InfoLogger {
  info(message: string, meta?: Record<string, unknown>): void;
}

/**
 * A Hono middleware that logs each HTTP request.
 *
 * @example
 *
 * ```ts
 * import logger from "./logger"; // Winston logger
 *
 * const app = new Hono();
 * app.use(requestLogger(logger));
 * ...
 * ```
 */
export default function requestLogger(logger: InfoLogger): MiddlewareHandler {
  return async (c, next) => {
    const { method } = c.req;
    const path = getPath(c.req.raw);

    const start = Date.now();

    await next();

    const { status } = c.res;

    logger.info("Request", {
      request: {
        method,
        path,
      },
      response: {
        status,
        ok: String(c.res.ok),
        time: ms(Date.now() - start),
      },
    });
  };
}
