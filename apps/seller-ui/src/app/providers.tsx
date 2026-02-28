"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";
import React, { useState } from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </JotaiProvider>
  );
};

export default Providers;
