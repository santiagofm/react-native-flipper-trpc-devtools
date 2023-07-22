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

export type RequestData = {
  id: string;
  type: OperationType;
  input: unknown;
  path: string;
  context: Record<string, unknown>;
  time: number;
  result: unknown;
  status: "success" | "error";
};

export type Events = {
  [PluginEvents.TRPC_DATA]: RequestData;
};
