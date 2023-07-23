import React from "react";
import { theme, styled } from "flipper-plugin";
import { Col, Row, Typography } from "antd";
import { RequestData, OperationType, OperationConfig } from "./types";

const TypeViewContainer = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 4,
  textAlign: "center",
  backgroundColor: theme.dividerColor,
  width: 20,
});

const OperationTypeView: React.FC<{ type?: OperationType }> = ({ type }) => {
  const typeString = type?.at(0)?.toUpperCase();
  const color = type ? OperationConfig[type].color : theme.dividerColor;

  return (
    <TypeViewContainer>
      <Typography.Text strong style={{ textAlign: "center", color }}>
        {typeString}
      </Typography.Text>
    </TypeViewContainer>
  );
};

type OperationViewProps = {
  data: RequestData;
};

export const OperationView: React.FC<OperationViewProps> = ({ data }) => {
  return (
    <Row gutter={6}>
      <Col>
        <OperationTypeView type={data.type} />
      </Col>
      <Col>
        <Typography.Text strong>{data.path}</Typography.Text>
      </Col>
    </Row>
  );
};
