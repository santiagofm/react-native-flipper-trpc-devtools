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
import { Events, PluginEvents, RequestData } from "./types";
import { OperationView } from "./OperationView";

const DurationFormatter = (value: any, highlighter?: HighlightManager) => {
  const formattedValue = `${value}ms`;
  return highlighter?.render(formattedValue) ?? value;
};

const columns: DataTableColumn<RequestData>[] = [
  {
    key: "type",
    title: "Query/Mutation/Subscription",
    width: 250,
    onRender: (row) => <OperationView data={row} />,
  },
  {
    key: "time",
    title: "Time",
    width: 60,
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
