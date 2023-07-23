import React from "react";
import { Layout, theme } from "flipper-plugin";
import { Badge, Typography } from "antd";
import { OperationConfig } from "./types";

export const ColorReference: React.FC = () => (
  <Layout.Horizontal
    pad={theme.space.tiny}
    gap={theme.space.tiny}
    style={{ backgroundColor: theme.dividerColor }}
  >
    {Object.entries(OperationConfig).map(([value, config]) => (
      <Layout.Horizontal
        key={value}
        padv={theme.space.tiny}
        padh={theme.inlinePaddingV}
        rounded={true}
        onClick={() => console.log(value)}
        style={{ backgroundColor: theme.buttonDefaultBackground }}
      >
        <Badge color={config.color} />
        <Typography.Text style={{ fontWeight: theme.bold }}>
          {config.label}
        </Typography.Text>
      </Layout.Horizontal>
    ))}
  </Layout.Horizontal>
);
