import React from "react";
import {
  Layout,
  theme,
  DataInspector,
  DetailSidebar,
  Panel,
} from "flipper-plugin";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Data } from "./types";
import { toUpperCaseFirstChar } from "./util";

const dataItemKeys: Array<keyof Data> = ["input", "duration", "result"];

type Props = {
  item: Data;
  close: VoidFunction;
};

export const LoggerDetailView: React.FC<Props> = ({ close, item }) => {
  const title = `${toUpperCaseFirstChar(item.type)}: ${item.path}`;

  return (
    <DetailSidebar width={550}>
      <Layout.Container
        gap
        pad
        grow
        style={{ backgroundColor: theme.backgroundWash }}
      >
        <Layout.Top>
          <Layout.Horizontal gap center>
            <CloseCircleOutlined onClick={close} />
            <Typography.Title level={theme.space.tiny}>
              {title}
            </Typography.Title>
          </Layout.Horizontal>
          <Layout.ScrollContainer
            style={{ backgroundColor: theme.backgroundWash }}
          >
            {dataItemKeys.map((key) => (
              <Panel
                key={key}
                collapsible={true}
                collapsed={true}
                title={toUpperCaseFirstChar(key)}
                pad={theme.space.small}
              >
                <DataInspector data={item[key]} expandRoot={true} />
              </Panel>
            ))}
          </Layout.ScrollContainer>
        </Layout.Top>
      </Layout.Container>
    </DetailSidebar>
  );
};
