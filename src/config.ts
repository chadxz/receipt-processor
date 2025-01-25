import { z } from "zod";
import process from "node:process";
import camelcaseKeys from "camelcase-keys";

export const configSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  })
  .transform((config) => camelcaseKeys(config));

export default configSchema.parse(process.env);
