import {
  SpanKind,
  SpanStatusCode,
  trace,
  type TracerProvider,
} from "@opentelemetry/api";
import {
  ATTR_HTTP_REQUEST_HEADER,
  ATTR_HTTP_REQUEST_METHOD,
  ATTR_HTTP_RESPONSE_HEADER,
  ATTR_HTTP_RESPONSE_STATUS_CODE,
  ATTR_URL_FULL,
  ATTR_HTTP_ROUTE,
} from "@opentelemetry/semantic-conventions";
import { createMiddleware } from "hono/factory";
import type { Env, Input } from "hono";

interface TracerOptions {
  tracerName?: string;
  tracerProvider?: TracerProvider;
}

export default function instrument<
  E extends Env = object,
  P extends string = string,
  I extends Input = object,
>(options: TracerOptions = {}) {
  const tracerProvider = options.tracerProvider ?? trace.getTracerProvider();
  return createMiddleware<E, P, I>(async (c, next) => {
    const tracer = tracerProvider.getTracer(
      options.tracerName ?? "middleware/tracer",
    );
    const { path } = c.req.matchedRoutes[c.req.matchedRoutes.length - 1] ?? {
      path: "unknown",
    };
    await tracer.startActiveSpan(
      `${c.req.method} ${path}`,
      {
        kind: SpanKind.SERVER,
        attributes: {
          [ATTR_HTTP_REQUEST_METHOD]: c.req.method,
          [ATTR_URL_FULL]: c.req.url,
          [ATTR_HTTP_ROUTE]: path,
        },
      },
      async (span) => {
        for (const [name, value] of Object.entries(c.req.header())) {
          span.setAttribute(ATTR_HTTP_REQUEST_HEADER(name), value);
        }
        try {
          await next();
          span.setAttribute(ATTR_HTTP_RESPONSE_STATUS_CODE, c.res.status);
          for (const [name, value] of c.res.headers.entries()) {
            span.setAttribute(ATTR_HTTP_RESPONSE_HEADER(name), value);
          }
          if (c.error) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: String(c.error),
            });
          }
        } catch (e) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: String(e) });
          throw e;
        } finally {
          span.end();
        }
      },
    );
  });
}
