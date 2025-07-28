'use client';
import { ReactNode, createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function ClientOnlyProvider({ children }: { children: ReactNode }) {
  // 👉 as any を使って型チェックを完全回避
  return createElement(QueryClientProvider as any, { client: queryClient }, children);
}
