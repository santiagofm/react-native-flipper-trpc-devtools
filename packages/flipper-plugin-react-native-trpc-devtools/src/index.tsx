import React from "react";
import {
  PluginClient,
  usePlugin,
  createState,
  useValue,
  Layout,
  Spinner,
  Toolbar,
  theme,
} from "flipper-plugin";
import { Typography } from "antd";

type Data = {
  id: string;
  message?: string;
};

type Events = {
  newData: Data;
};

export function plugin(client: PluginClient<Events, {}>) {
  const isConnected = createState<boolean>(client.isConnected);
  const data = createState<Record<string, Data>>({}, { persist: "data" });

  client.addMenuEntry({
    action: "clear",
    accelerator: "ctrl+l",
    handler: async () => {
      data.set({});
    },
  });

  client.onMessage("newData", (newData) => {
    data.update((draft) => {
      draft[newData.id] = newData;
    });
  });

  client.onConnect(() => {
    isConnected.set(true);
  });

  client.onDisconnect(() => {
    isConnected.set(false);
    data.set({});
  });

  return { data, isConnected };
}

export function Component() {
  const instance = usePlugin(plugin);
  const isConnected = useValue(instance.isConnected);
  const data = useValue(instance.data);

  if (isConnected) {
    return (
      <>
        <Toolbar wash>
          <Typography.Text type="secondary">
            Waiting for device...
          </Typography.Text>
        </Toolbar>
      </>
    );
  }

  return (
    //@ts-ignore FIXME: For some reason it doesn't like the children types or it's missing
    <Layout.ScrollContainer>
      {Object.entries(data).map(([id, d]) => (
        <pre key={id} data-testid={id}>
          {JSON.stringify(d)}
        </pre>
      ))}
    </Layout.ScrollContainer>
  );
}
