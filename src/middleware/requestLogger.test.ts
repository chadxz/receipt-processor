import requestLogger from "./requestLogger";
import { Hono } from "hono";
import { testClient } from "hono/testing";

describe("requestLogger", () => {
  it("logs the request", async () => {
    const logger = { info: vi.fn() };

    const app = new Hono().use(requestLogger(logger)).get("/", (c) => {
      return c.json({ hello: "world" });
    });

    await testClient(app).index.$get("/");
    expect(logger.info).toHaveBeenCalledWith("Request", {
      request: {
        method: "GET",
        path: "/",
      },
      response: {
        ok: "true",
        status: 200,
        time: expect.any(String),
      },
    });
  });
});
