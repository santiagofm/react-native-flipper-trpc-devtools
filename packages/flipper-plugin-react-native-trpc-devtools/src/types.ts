import { theme } from "flipper-plugin";

export const PluginEvents = {
  TRPC_REQUEST: "TRPC_REQUEST",
  TRPC_RESPONSE: "TRPC_RESPONSE",
} as const;

export type PluginEvents = (typeof PluginEvents)[keyof typeof PluginEvents];

export const Operation = {
  QUERY: "query",
  MUTATION: "mutation",
  SUBSCRIPTION: "subscription",
} as const;

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

const Status = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

type RequestData = {
  id: string;
  opId: string;
  timestamp: number;
  type: OperationType;
  input: unknown;
  path: string;
  context: Record<string, unknown>;
};

type ResponseData = {
  id: string;
  opId: string;
  startTime: number;
  timestamp: number;
  duration: number;
  result: unknown;
  status: StatusType;
};

type LocalData = {
  isSubscriptionRunning?: boolean;
};

export type Data = RequestData & Partial<ResponseData> & LocalData;

export type Events = {
  [PluginEvents.TRPC_REQUEST]: Data;
  [PluginEvents.TRPC_RESPONSE]: Data;
};

export const StatusConfig = {
  [Status.SUCCESS]: {
    label: "OK",
    color: theme.successColor,
  },
  [Status.ERROR]: {
    label: "ERROR",
    color: theme.errorColor,
  },
};
