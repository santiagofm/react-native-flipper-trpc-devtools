import { theme } from "flipper-plugin";

export const PluginEvents = {
  TRPC_DATA: "TRPC_DATA",
} as const;

export type PluginEvents = (typeof PluginEvents)[keyof typeof PluginEvents];

export const Operation = {
  QUERY: "query",
  MUTATION: "mutation",
  SUBSCRIPTION: "subscription",
};

export type OperationType = (typeof Operation)[keyof typeof Operation];

export const OperationConfig = {
  [Operation.QUERY]: {
    label: "Query",
    color: theme.primaryColor,
  },
  [Operation.MUTATION]: {
    label: "Mutation",
    color: theme.successColor,
  },
  [Operation.SUBSCRIPTION]: {
    label: "Subscription",
    color: theme.warningColor,
  },
};

export type RequestData = {
  id: string;
  timestamp: number;
  duration: number;
  type: OperationType;
  input: unknown;
  path: string;
  context: Record<string, unknown>;
  result: unknown;
  status: "success" | "error";
};

export type Events = {
  [PluginEvents.TRPC_DATA]: RequestData;
};
