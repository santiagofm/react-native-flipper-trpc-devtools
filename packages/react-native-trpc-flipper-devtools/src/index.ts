import { addPlugin, Flipper } from "react-native-flipper";
import {
  OperationResultEnvelope,
  TRPCClientError,
  TRPCLink,
} from "@trpc/client";
import { AnyRouter } from "@trpc/server";
import { observable, tap } from "@trpc/server/observable";

const FLIPPER_PLUGIN_NAME = "react-native-trpc-devtools";

let _connection: Flipper.FlipperConnection | undefined = undefined;

type RequestResult<TRouter extends AnyRouter> =
  | OperationResultEnvelope<unknown>
  | TRPCClientError<TRouter>;

type DevToolsLinkOptions = {
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export const flipperDevToolsLink = <TRouter extends AnyRouter = AnyRouter>(
  opts: DevToolsLinkOptions = {}
): TRPCLink<TRouter> => {
  const { enabled = true } = opts;

  addPlugin({
    getId: () => FLIPPER_PLUGIN_NAME,
    onConnect: (connection) => {
      _connection = connection;
      opts.onConnect?.();
    },
    onDisconnect: () => {
      _connection = undefined;
      opts.onDisconnect?.();
    },
    runInBackground: () => {
      return false;
    },
  });

  return () => {
    return ({ op, next }) => {
      return observable((observer) => {
        if (!enabled) {
          return next(op).subscribe(observer);
        }

        const requestStartTime = Date.now();
        const id = `${op.type}:${op.id}`;
        const requestData = {
          id,
          opId: op.id,
          timestamp: requestStartTime,
          type: op.type,
          input: op.input,
          path: op.path,
          context: op.context,
        };

        _connection?.send("TRPC_REQUEST", requestData);

        const sendDataToPlugin = (result: RequestResult<TRouter>) => {
          const timestamp = Date.now();
          const duration = timestamp - requestStartTime;
          const isError = result instanceof Error || "error" in result.result;
          const status = isError ? "error" : "success";

          _connection?.send("TRPC_RESPONSE", {
            ...requestData,
            startTime: requestStartTime,
            timestamp,
            duration,
            status,
            result,
          });
        };

        return next(op)
          .pipe(
            tap({
              next(result) {
                sendDataToPlugin(result);
              },
              error(result) {
                sendDataToPlugin(result);
              },
            })
          )
          .subscribe(observer);
      });
    };
  };
};
