import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from './trpc';
import { Example } from './Example';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Example />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
