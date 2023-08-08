# tRPC Client Flipper devtools

A [Flipper](https://github.com/facebook/flipper) plugin to visualize [tRPC](https://github.com/trpc/trpc) procedure calls for a React Native app.

<img width="1314" src="https://github.com/santiagofm/react-native-flipper-trpc-devtools/assets/6749415/bb51b6ef-b3f2-457f-9924-a91562c1bcc2" />

> _Devtools in action with the [example client app](https://github.com/santiagofm/react-native-flipper-trpc-devtools/tree/main/packages/example-client)_

## Setup devtools

1. Install dependencies:

```bash
yarn add -d react-native-apollo-devtools-client react-native-flipper
```

2. Initialize the plugin as a tRPC client middleware:

```typescript
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { flipperDevToolsLink } from 'react-native-trpc-flipper-devtools';

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    flipperDevToolsLink({
      enabled: __DEV__,
    }),
    httpBatchLink({
      url: "http://localhost:3000",
    }),
  ],
});
```

## Setup Flipper

1. Open the `Plugins Manager` > `Install Plugins` tab, search for `flipper-plugin-react-native-trpc` and install the plugin.

2. Restart flipper.

3. You should now see `tRPC DevTools` on the sidebar.
