import React, { createRef } from "react";
import {
  PluginClient,
  createState,
  createDataSource,
  DataFormatter,
  DataTableColumn,
  HighlightManager,
  DataTableManager,
} from "flipper-plugin";
import {
  Events,
  Operation,
  OperationConfig,
  PluginEvents,
  RequestData,
} from "./types";
import { OperationView } from "./OperationView";

const TimestampFormatter = (value: number, highlighter?: HighlightManager) => {
  const formattedValue = new Date(value).toLocaleTimeString(undefined, {
    hour12: false,
  });
  return highlighter?.render(formattedValue) ?? value;
};

const DurationFormatter = (value: number, highlighter?: HighlightManager) => {
  const formattedValue = `${value}ms`;
  return highlighter?.render(formattedValue) ?? value;
};

const columns: DataTableColumn<RequestData>[] = [
  {
    key: "timestamp",
    title: "Time",
    width: 70,
    formatters: TimestampFormatter,
  },
  {
    key: "type",
    title: "Query/Mutation/Subscription",
    width: 220,
    filters: Object.entries(OperationConfig).map(([value, config]) => ({
      label: config.label,
      value,
      enabled: false,
    })),
    onRender: (row) => <OperationView data={row} />,
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
  const data = createDataSource<RequestData, "id">([], {
    limit: 200000,
    persist: "logs",
    key: "id",
  });
  const tableManagerRef = createRef<
    DataTableManager<RequestData> | undefined
  >();

  const isConnected = createState<boolean>(client.isConnected);
  const selectedID = createState<string | null>(null);

  client.onMessage(PluginEvents.TRPC_DATA, (newData) => {
    // TODO: Should check if existing value already and update it instead
    data.append(newData);
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

  const setSelection = (item?: RequestData) => {
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
