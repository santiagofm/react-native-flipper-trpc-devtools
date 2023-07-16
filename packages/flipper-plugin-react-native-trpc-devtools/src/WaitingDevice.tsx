import React from "react";
import { Layout, Spinner, theme } from "flipper-plugin";
import { Card, Typography } from "antd";

export const WaitingDevice: React.FC = () => {
  return (
    <Layout.Container
      center
      grow
      style={{
        justifyContent: "center",
        backgroundColor: theme.backgroundWash,
      }}
    >
      <Spinner />
      <Typography.Text type="secondary">Waiting for device...</Typography.Text>
    </Layout.Container>
  );
};
