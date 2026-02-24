'use client';

import { StyledEngineProvider } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <StyledEngineProvider injectFirst>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </StyledEngineProvider>
  );
}