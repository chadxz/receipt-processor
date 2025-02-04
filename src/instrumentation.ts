import "./register";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";
import { Resource } from "@opentelemetry/resources";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import {
  SimpleLogRecordProcessor,
  ConsoleLogRecordExporter,
} from "@opentelemetry/sdk-logs";
import config from "./config";
import packageJson from "../package.json";

const debugConfig = {
  traceExporter: new ConsoleSpanExporter(),
  logRecordProcessors: [
    new SimpleLogRecordProcessor(new ConsoleLogRecordExporter()),
  ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
};

const grafanaAuthorizationHeader =
  config.grafanaCloudOtlpAuthorizationHeader ?? "";
const grafanaConfig = {
  traceExporter: new OTLPTraceExporter({
    url: "https://otlp-gateway-prod-us-east-2.grafana.net/otlp/v1/traces",
    headers: {
      Authorization: grafanaAuthorizationHeader,
    },
  }),
  logRecordProcessors: [
    new SimpleLogRecordProcessor(
      new OTLPLogExporter({
        url: "https://otlp-gateway-prod-us-east-2.grafana.net/otlp/v1/logs",
        headers: {
          Authorization: grafanaAuthorizationHeader,
        },
      }),
    ),
  ],
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: "https://otlp-gateway-prod-us-east-2.grafana.net/otlp/v1/metrics",
      headers: {
        Authorization: grafanaAuthorizationHeader,
      },
    }),
  }),
};

const sdk = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: packageJson.name,
    [ATTR_SERVICE_VERSION]: config.vcsRef,
  }),
  instrumentations: [new WinstonInstrumentation()],
  ...(config.otelDebug
    ? debugConfig
    : config.grafanaCloudOtlpAuthorizationHeader
      ? grafanaConfig
      : {}),
});

sdk.start();
