import React from 'react';
import {
  SafeAreaView,
  Text,
  ScrollView,
  StyleSheet,
  Button,
} from 'react-native';
import { trpc } from './trpc';

export const Example: React.FC = () => {
  const { data, refetch } = trpc.greeting.useQuery();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text>{data?.text}</Text>
        <Button onPress={() => refetch()} title="Refetch" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
