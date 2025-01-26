import { z } from "@hono/zod-openapi";
import itemSchema from "./item.js";

export default z
  .object({
    retailer: z
      .string()
      .regex(
        /^[\w\s\-&]+$/,
        "Retailer name must be defined and may only contain letters, numbers, spaces, hyphens, and ampersands.",
      )
      .openapi({
        example: "M&M Corner Market",
        description: "The name of the retailer or store the receipt is from.",
      }),
    purchaseDate: z
      .string()
      .date("Must be a valid date in YYYY-MM-DD format.")
      .openapi({
        format: "date",
        example: "2022-01-01",
        description: "The date of the purchase printed on the receipt.",
      }),
    purchaseTime: z
      .string()
      .regex(
        /^\d\d:\d\d$/,
        "Time must be in 24-hour format and should not include seconds.",
      )
      .openapi({
        format: "time",
        example: "13:01",
        description:
          "The time of the purchase printed on the receipt. 24-hour time expected.",
      }),
    total: z
      .string()
      .regex(
        /^\d+\.\d{2}$/,
        "Total must be a valid number with 2 decimal places.",
      )
      .openapi({
        example: "6.49",
        description: "The total amount paid on the receipt.",
      }),
    items: z.array(itemSchema).min(1),
  })
  .openapi("Receipt");
