"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        // 모바일 망에서 잠깐 끊기면 1번 재시도로는 부족해 바로 오류 화면이 떴다 (2026-10-27).
        // 요청마다 15초 시간 초과가 있어 더 늘리면 오류 화면까지 1분 넘게 스피너만 돈다.
        retry: 2,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
