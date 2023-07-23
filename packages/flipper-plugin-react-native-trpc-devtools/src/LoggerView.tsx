import React from "react";
import { usePlugin, useValue, Layout, theme, DataTable } from "flipper-plugin";
import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { WaitingDevice } from "./WaitingDevice";
import hotkeys from "hotkeys-js";
import { Data } from "./types";
import { LoggerPlugin } from "./LoggerPlugin";
import { LoggerDetailView } from "./LoggerDetailView";
import { ColorReference } from "./ColorReference";

const getRowStyle = () => theme.monospace;

export const LoggerView: React.FC = () => {
  const instance = usePlugin(LoggerPlugin);
  const isConnected = useValue(instance.isConnected);
  const selectedId = useValue(instance.selectedID);

  React.useEffect(() => {
    hotkeys("ctrl+c", () => instance.data.clear());
    return () => {
      hotkeys.unbind("ctrl+c", () => instance.data.clear());
    };
  }, []);

  if (!isConnected) {
    return <WaitingDevice />;
  }

  return (
    <Layout.Container grow>
      <Layout.Bottom>
        <Layout.ScrollContainer
          vertical
          style={{ backgroundColor: theme.backgroundWash }}
        >
          <DataTable<Data>
            tableManagerRef={instance.tableManagerRef}
            dataSource={instance.data}
            columns={instance.columns}
            enableAutoScroll={true}
            enableMultiPanels={true}
            enableHorizontalScroll={false}
            onSelect={instance.setSelection}
            onRowStyle={getRowStyle}
            extraActions={
              <Button title="Clear log" onClick={instance.clearData}>
                <DeleteOutlined />
              </Button>
            }
          />
        </Layout.ScrollContainer>
        <ColorReference />
      </Layout.Bottom>
      {selectedId && (
        <LoggerDetailView
          close={instance.clearSelection}
          data={instance.data.getById(selectedId)}
        />
      )}
    </Layout.Container>
  );
};
