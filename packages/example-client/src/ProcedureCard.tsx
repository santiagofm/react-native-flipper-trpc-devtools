import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text, View, WingBlank } from '@ant-design/react-native';

type Props = {
  title: string;
  value?: string;
  button?: {
    title: string;
    onPress: () => void;
  };
};

export const ProcedureCard: React.FC<React.PropsWithChildren & Props> = ({
  children,
  title,
  value,
  button,
}) => (
  <WingBlank size="md">
    <Card>
      <Card.Header title={title} />
      <Card.Body>
        <WingBlank size="lg">
          {children}
          <View style={styles.bodyContainer}>
            {value && <Text>{value}</Text>}
            {button && (
              <Button type="primary" onPress={button.onPress}>
                <Text style={styles.buttonText}>{button.title}</Text>
              </Button>
            )}
          </View>
        </WingBlank>
      </Card.Body>
    </Card>
  </WingBlank>
);

const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
  },
  bodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});
