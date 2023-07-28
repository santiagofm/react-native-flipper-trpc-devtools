# tRPC Client Flipper devtools

A [Flipper](https://github.com/facebook/flipper) plugin to visualize [tRPC](https://github.com/trpc/trpc) procedure calls for a React Native app.

<img width="1314" alt="Screenshot 2023-07-28 at 20 08 21" src="https://github.com/santiagofm/react-native-flipper-trpc-devtools/assets/6749415/fcef97d2-9532-4e4f-8d4a-d98bf81d3dc5">

> _Devtools in action with the[example client app](https://github.com/santiagofm/react-native-flipper-trpc-devtools/tree/main/packages/example-client)_

## Setup devtools

1. Install dependencies:

```bash
yarn add -d react-native-apollo-devtools-client react-native-flipper
```

2. Initialize the plugin as a tRPC client middleware:

```typescript
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
```

## Setup Flipper

1. Open the `Plugins Manager` > `Install Plugins` tab, search for `flipper-plugin-react-native-trpc` and install the plugin.

2. Restart flipper.

3. You should now see `tRPC DevTools` on the sidebar.
