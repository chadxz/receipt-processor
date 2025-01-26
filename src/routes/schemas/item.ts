import { z } from "@hono/zod-openapi";

export default z
  .object({
    shortDescription: z
      .string()
      .regex(
        /^[\w\s-]+$/,
        "Item short description must be defined and may only contain letters, numbers, spaces, and hyphens.",
      )
      .openapi({
        example: "Mountain Dew 12PK",
        description: "The Short Product Description for the item.",
      }),
    price: z
      .string()
      .regex(
        /^\d+\.\d{2}$/,
        "Price must be a valid number with 2 decimal places.",
      )
      .openapi({
        example: "6.49",
        description: "The total price paid for this item.",
      }),
  })
  .openapi("Item", {
    description: "A receipt line item.",
  });
