import { createWSClient, wsLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../../example-server';
import { flipperDevToolsLink } from 'react-native-trpc-flipper-devtools';

const SERVER_URL = 'ws://localhost:9999';

export const trpc = createTRPCReact<AppRouter>();

const wsClient = createWSClient({
  url: SERVER_URL,
});

export const trpcClient = trpc.createClient({
  links: [
    flipperDevToolsLink({
      enabled: __DEV__,
    }),
    wsLink({
      client: wsClient,
    }),
  ],
});
