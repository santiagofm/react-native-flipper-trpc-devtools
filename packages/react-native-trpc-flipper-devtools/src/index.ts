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

type MiddlewareLinkOptions = {
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
};

export const flipperDevToolsLink = <TRouter extends AnyRouter = AnyRouter>(
  opts: MiddlewareLinkOptions = {}
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
        function logResult(
          result: OperationResultEnvelope<unknown> | TRPCClientError<TRouter>
        ) {
          const elapsedMs = Date.now() - requestStartTime;
          if (enabled) {
            _connection?.send("newData", {
              ...op,
              elapsedMs,
              result,
            });
            console.log({
              ...op,
              elapsedMs,
              result,
            });
          }
        }
        return next(op)
          .pipe(
            tap({
              next(result) {
                logResult(result);
              },
              error(result) {
                logResult(result);
              },
            })
          )
          .subscribe(observer);
      });
    };
  };
};
