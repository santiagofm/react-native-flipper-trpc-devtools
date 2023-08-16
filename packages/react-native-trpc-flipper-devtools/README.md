# react-native-trpc-flipper-devtools

## Setup

1. Install the package and dependencies:

```bash
yarn add -d react-native-apollo-devtools-client react-native-flipper
```

2. Initialize the plugin as a tRPC client middleware:

```typescript
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import { flipperDevToolsLink } from "react-native-trpc-flipper-devtools";

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
