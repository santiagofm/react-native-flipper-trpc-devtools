import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

import { trpc } from './trpc';
import { ProcedureCard } from './ProcedureCard';
import { InputItem, WhiteSpace } from '@ant-design/react-native';

export const Example: React.FC = () => {
  const [input1, setInput1] = React.useState('');
  const { data: greeting, refetch: refetchGreeting } = trpc.greeting.useQuery({
    name: input1,
  });

  const { data: nestedGreeting, refetch: refetchNestedGreeting } =
    trpc.nested.greeting.useQuery();

  const [input2, setInput2] = React.useState('');
  const { mutateAsync: setGreeting } = trpc.nested.setGreeting.useMutation({
    onSuccess: refetchNestedGreeting,
  });

  const [serverTime, setServerTime] = React.useState<string>();
  const [subscriptionEnabled, setSubscriptionEnabled] = React.useState(true);
  trpc.time.useSubscription(undefined, {
    enabled: subscriptionEnabled,
    onData: data => setServerTime(data),
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <ProcedureCard
          title="Query"
          value={greeting?.text}
          button={{
            title: 'Refetch',
            onPress: refetchGreeting,
          }}>
          <InputItem
            clear
            value={input1}
            onChange={setInput1}
            placeholder="Some input"
            style={styles.input}
          />
        </ProcedureCard>
        <WhiteSpace size="lg" />
        <ProcedureCard
          title="Nested Query"
          value={nestedGreeting?.hello}
          button={{
            title: 'Refetch',
            onPress: refetchNestedGreeting,
          }}
        />
        <WhiteSpace size="lg" />
        <ProcedureCard
          title="Mutation"
          button={{
            title: 'Set Nested Greeting',
            onPress: () => setGreeting({ greeting: input2 }),
          }}>
          <InputItem
            clear
            value={input2}
            onChange={setInput2}
            placeholder="Some new greeting"
            style={styles.input}
          />
        </ProcedureCard>
        <WhiteSpace size="lg" />
        <ProcedureCard
          title="Subscription"
          value={serverTime}
          button={{
            title: subscriptionEnabled ? 'Stop' : 'Start',
            onPress: () => setSubscriptionEnabled(enabled => !enabled),
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 4,
  },
});
