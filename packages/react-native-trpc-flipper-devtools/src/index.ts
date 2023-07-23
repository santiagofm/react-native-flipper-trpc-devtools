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
        const requestStartTime = Date.now();

        if (enabled) {
          _connection?.send("TRPC_REQUEST", {
            id: op.id,
            timestamp: requestStartTime,
            type: op.type,
            input: op.input,
            path: op.path,
            context: op.context,
          });
          console.log("TRPC Request:", {
            id: op.id,
            timestamp: requestStartTime,
            type: op.type,
            input: op.input,
            path: op.path,
            context: op.context,
          });
        }

        const sendDataToPlugin = (result: RequestResult<TRouter>) => {
          const duration = Date.now() - requestStartTime;

          if (enabled) {
            const isError = result instanceof Error || "error" in result.result;
            const status = isError ? "error" : "success";

            // TODO: Determine status
            _connection?.send("TRPC_RESPONSE", {
              id: op.id,
              duration,
              status,
              result,
            });
            console.log("TRPC Response:", {
              id: op.id,
              duration,
              status,
              result,
            });
          }
        };

        // TODO: Can maybe send two events per request? One for the request and one for the response?
        // https://github.com/rhenriquez28/trpc-client-devtools/blob/95bf29b4c383b92a2b9f2c96562a52e2135fa4ee/packages/devtools-link/src/index.ts#L41-L46

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
