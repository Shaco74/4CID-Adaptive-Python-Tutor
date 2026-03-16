import { Box } from '@chakra-ui/react';

export function ErrorMessageBox({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <Box p={4} bg="red.50" color="red.500" borderRadius="md">
      {error}
    </Box>
  );
}
