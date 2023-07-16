import React from "react";
import {
  PluginClient,
  usePlugin,
  createState,
  useValue,
  Layout,
  theme,
  DetailSidebar,
  DataInspector,
} from "flipper-plugin";
import { Card, Typography } from "antd";
import { WaitingDevice } from "./WaitingDevice";

type Data = {
  id: string;
  elapsedMs: string;
};

type Events = {
  newData: Data;
};

export function plugin(client: PluginClient<Events, {}>) {
  const isConnected = createState<boolean>(client.isConnected);
  const data = createState<Record<string, Data>>({}, { persist: "data" });
  const selectedID = createState<string | null>(null, { persist: "selection" });

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
    selectedID.set(null);
    isConnected.set(false);
    data.set({});
  });

  const setSelection = (id: string) => {
    selectedID.set(id);
  };

  return { data, isConnected, selectedID, setSelection };
}

export function Component() {
  const instance = usePlugin(plugin);
  const isConnected = useValue(instance.isConnected);
  const data = useValue(instance.data);
  const selectedID = useValue(instance.selectedID);

  if (!isConnected) {
    return <WaitingDevice />;
  }

  return (
    <>
      <Layout.ScrollContainer
        vertical
        style={{ background: theme.backgroundWash }}
      >
        {Object.entries(data).map(([id, d]) => (
          <DataCard
            data={d}
            onSelect={instance.setSelection}
            selected={id === selectedID}
            key={id}
          />
        ))}
      </Layout.ScrollContainer>
      <DetailSidebar>
        {selectedID && (
          <Layout.Container gap pad>
            <Typography.Title level={4}>Extras</Typography.Title>
            <DataInspector data={data[selectedID]} expandRoot={true} />
          </Layout.Container>
        )}
      </DetailSidebar>
    </>
  );
}

type CardProps = {
  onSelect: (id: string) => void;
  selected: boolean;
  data: Data;
};
const DataCard = React.memo(({ data, selected, onSelect }: CardProps) => {
  console.log({
    data,
  });
  return (
    <Card
      hoverable
      onClick={() => onSelect(data.id)}
      title={data.elapsedMs + "ms"}
      style={{
        width: 150,
        borderColor: selected ? theme.primaryColor : undefined,
      }}
    />
  );
});
