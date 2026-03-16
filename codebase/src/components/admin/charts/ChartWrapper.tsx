"use client";

import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";

interface ChartWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper to ensure Recharts only renders client-side
 * Prevents SSR hydration issues
 */
export function ChartWrapper({ children }: ChartWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Box
        bg="gray.800"
        p={6}
        borderRadius="lg"
        border="1px solid"
        borderColor="gray.700"
        h="400px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Loading chart...
      </Box>
    );
  }

  return <>{children}</>;
}
