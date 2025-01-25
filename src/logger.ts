import winston from "winston";
import config from "./config";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "receipt-processor" },
  transports: [
    new winston.transports.Console({
      silent: config.nodeEnv === "test",
      format:
        config.nodeEnv === "production"
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            ),
    }),
  ],
});

export default logger;
