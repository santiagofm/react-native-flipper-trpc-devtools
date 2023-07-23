import React, { createRef } from "react";
import {
  PluginClient,
  createState,
  createDataSource,
  DataFormatter,
  DataTableColumn,
  HighlightManager,
  DataTableManager,
  theme,
} from "flipper-plugin";
import {
  Events,
  OperationConfig,
  PluginEvents,
  Data,
  StatusConfig,
} from "./types";
import { OperationView } from "./OperationView";
import { Typography } from "antd";

const TimestampFormatter = (value?: number, highlighter?: HighlightManager) => {
  if (!value) return "-";

  const formattedValue = new Date(value).toLocaleTimeString(undefined, {
    hour12: false,
  });
  return highlighter?.render(formattedValue) ?? value;
};

const DurationFormatter = (value?: number, highlighter?: HighlightManager) => {
  if (!value) return "";

  const formattedValue = `${value}ms`;
  return highlighter?.render(formattedValue) ?? value;
};

const columns: DataTableColumn<Data>[] = [
  {
    key: "timestamp",
    title: "Time",
    width: 70,
    formatters: TimestampFormatter,
  },
  {
    key: "type",
    title: "Procedure",
    width: 200,
    filters: Object.entries(OperationConfig).map(([value, config]) => ({
      label: config.label,
      value,
      enabled: false,
    })),
    onRender: (row) => <OperationView data={row} />,
  },
  {
    key: "status",
    title: "Status",
    width: 80,
    align: "center",
    filters: Object.entries(StatusConfig).map(([value, config]) => ({
      label: config.label,
      value,
      enabled: false,
    })),
    onRender: (row) => {
      const config =
        row.status != null
          ? StatusConfig[row.status]
          : { label: "PENDING", color: theme.warningColor };

      return (
        <Typography style={{ color: config.color }}>{config.label}</Typography>
      );
    },
  },
  {
    key: "duration",
    title: "Duration",
    width: 80,
    align: "center",
    formatters: DurationFormatter,
  },
  {
    key: "result",
    title: "Result",
    sortable: false,
    formatters: [DataFormatter.truncate(400), DataFormatter.prettyPrintJson],
  },
];

export const LoggerPlugin = (client: PluginClient<Events, {}>) => {
  const data = createDataSource<Data, "id">([], {
    limit: 200000,
    persist: "logs",
    key: "id",
  });
  const tableManagerRef = createRef<DataTableManager<Data> | undefined>();

  const isConnected = createState<boolean>(client.isConnected);
  const selectedID = createState<string | null>(null);

  client.onMessage(PluginEvents.TRPC_REQUEST, (item) => {
    // TODO: Should check if existing value already and update it instead
    data.append(item);
  });

  client.onMessage(PluginEvents.TRPC_RESPONSE, (item) => {
    const existingDataItem = data.getById(item.id);
    if (!existingDataItem) {
      console.error("Could not find existing data item for id", item.id);
      return;
    }

    data.upsert({
      ...existingDataItem,
      ...item,
    });
  });

  client.onConnect(() => {
    isConnected.set(true);
  });

  client.onDisconnect(() => {
    isConnected.set(false);
    clearData();
  });

  const clearSelection = () => {
    selectedID.set(null);
    tableManagerRef.current?.clearSelection();
  };

  const clearData = () => {
    clearSelection();
    data.clear();
  };

  const setSelection = (item?: Data) => {
    if (!item) return;

    selectedID.set(item.id);
  };

  return {
    data,
    columns,
    isConnected,
    selectedID,
    setSelection,
    clearSelection,
    clearData,
    tableManagerRef,
  };
};
