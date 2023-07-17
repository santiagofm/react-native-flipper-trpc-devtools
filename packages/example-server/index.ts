import { initTRPC } from "@trpc/server";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { observable } from "@trpc/server/observable";
import EventEmitter from "events";
import ws from "ws";
import { z } from "zod";

const PORT = 9999;

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const ee = new EventEmitter();

let nestedState = "world";

const nested = router({
  greeting: publicProcedure.query(() => ({
    hello: nestedState,
  })),
  setGreeting: publicProcedure
    .input(
      z.object({
        greeting: z.string(),
      })
    )
    .mutation(({ input }) => {
      nestedState = input.greeting;
    }),
});

const appRouter = router({
  nested,
  greeting: publicProcedure
    .input(
      z
        .object({
          name: z.string().nullish(),
        })
        .nullish()
    )
    .query(({ input }) => {
      return {
        text: `hello ${input?.name ?? "world"}`,
      };
    }),
  time: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      const onTime = (data: string) => {
        emit.next(data);
      };
      ee.on("time", onTime);
      return () => {
        ee.off("time", onTime);
      };
    });
  }),
});

const recurringInterval = setInterval(() => {
  ee.emit("time", Date.now().toString());
}, 1500);

export type AppRouter = typeof appRouter;

const wss = new ws.Server({
  port: PORT,
});
const handler = applyWSSHandler({ wss, router: appRouter });

wss.on("connection", (ws) => {
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

console.log(`✅ WebSocket Server listening on ws://localhost:${PORT}`);

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  handler.broadcastReconnectNotification();
  clearInterval(recurringInterval);
  wss.close();
});
