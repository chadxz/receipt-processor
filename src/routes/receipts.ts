import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import receiptSchema from "./schemas/receipt";
import logger from "../logger";
import receipts from "../models/receipts";

const receiptsRouter = new OpenAPIHono({
  defaultHook: (result, c) => {
    if (!result.success) {
      const formatted = result.error.format();
      logger.error("Request validation error", { error: formatted });
      return c.json(
        {
          message: "There was a problem validating your request.",
          problems: formatted,
        },
        400,
      );
    }
  },
})
  /**
   * POST /receipts/process
   */
  .openapi(
    createRoute({
      method: "post",
      path: "/receipts/process",
      description: "Submit a receipt for processing.",
      tags: ["Receipts"],
      operationId: "process",
      request: {
        body: {
          required: true,
          content: {
            "application/json": {
              schema: receiptSchema,
            },
          },
        },
      },
      responses: {
        200: {
          description: "The ID assigned to the receipt.",
          content: {
            "application/json": {
              schema: z.object({
                id: z.string().regex(/^\S+$/).openapi({
                  example: "adb6b560-0eef-42bc-9d16-df48f30e89b2",
                  description: "The ID assigned to the receipt.",
                }),
              }),
            },
          },
        },
        400: {
          $ref: "#/components/responses/BadRequest",
        },
      },
    }),
    (c) => {
      const receipt = c.req.valid("json");
      logger.info("Received receipt to process", { receipt });

      const created = receipts.create({
        retailer: receipt.retailer,
        purchaseDate: receipt.purchaseDate,
        purchaseTime: receipt.purchaseTime,
        total: receipt.total,
        items: receipt.items.map((item) => ({
          shortDescription: item.shortDescription,
          price: item.price,
        })),
      });

      return c.json({ id: created.id }, 200);
    },
  )
  /**
   * GET /receipts/{id}/points
   */
  .openapi(
    createRoute({
      method: "get",
      path: "/receipts/{id}/points",
      operationId: "receiptPoints",
      description: "Retrieve the points awarded for the receipt.",
      tags: ["Receipts"],
      request: {
        params: z.object({
          id: z.string().regex(/^\S+$/).openapi({
            example: "adb6b560-0eef-42bc-9d16-df48f30e89b2",
            description: "The ID of the receipt.",
          }),
        }),
      },
      responses: {
        200: {
          description: "The number of points awarded.",
          content: {
            "application/json": {
              schema: z.object({
                points: z.number().int().openapi({
                  example: 100,
                  description: "The number of points awarded.",
                  format: "int64",
                }),
              }),
            },
          },
        },
        404: {
          $ref: "#/components/responses/NotFound",
        },
      },
    }),
    (c) => {
      const { id } = c.req.valid("param");
      logger.info("Retrieving points for receipt", { receiptId: id });

      const receipt = receipts.get(id);
      if (!receipt) {
        return c.notFound();
      }

      return c.json({ points: receipt.points }, 200);
    },
  );

receiptsRouter.openAPIRegistry.registerComponent("responses", "BadRequest", {
  description: "The receipt is invalid.",
});

receiptsRouter.openAPIRegistry.registerComponent("responses", "NotFound", {
  description: "No receipt found for that ID.",
});

export default receiptsRouter;
