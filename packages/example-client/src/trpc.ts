import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../../example-server';
import { flipperDevToolsLink } from 'react-native-trpc-flipper-devtools';

const SERVER_URL = 'http://localhost:3000';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    flipperDevToolsLink(),
    httpBatchLink({
      url: SERVER_URL,
    }),
  ],
});
