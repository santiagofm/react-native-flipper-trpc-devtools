import React from "react";
import { Layout, theme, DataInspector, DetailSidebar } from "flipper-plugin";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { Data } from "./types";

type Props = {
  data?: Data;
  close: VoidFunction;
};

export const LoggerDetailView: React.FC<Props> = ({ close, data }) => (
  <DetailSidebar width={500}>
    <Layout.Container
      gap
      pad
      grow
      style={{ backgroundColor: theme.backgroundWash }}
    >
      <Layout.Horizontal gap center>
        <CloseCircleOutlined onClick={close} />
        <Typography.Title level={theme.space.tiny}>Extras</Typography.Title>
      </Layout.Horizontal>
      <DataInspector data={data} expandRoot={true} />
    </Layout.Container>
  </DetailSidebar>
);
