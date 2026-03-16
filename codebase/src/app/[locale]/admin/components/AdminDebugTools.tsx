import { Box, Heading, Flex, Button } from '@chakra-ui/react';

interface AdminDebugToolsProps {
  onListJsonFiles: () => void;
  onGetAllJsonContents: () => void;
}

export function AdminDebugTools({ onListJsonFiles, onGetAllJsonContents }: AdminDebugToolsProps) {
  return (
    <Box mt={6} mb={4}>
      <Heading size="md" mb={3}>Debug Tools (Vercel DB)</Heading>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={4}
        width="100%"
        flexWrap="wrap"
      >
        <Button
          colorScheme="purple"
          onClick={onListJsonFiles}
          size="lg"
          flex={{ base: "1 1 100%", sm: "0 1 auto" }}
          minW={{ sm: "250px" }}
        >
          Liste aller DB Dateien (Console)
        </Button>
        <Button
          colorScheme="teal"
          onClick={onGetAllJsonContents}
          size="lg"
          flex={{ base: "1 1 100%", sm: "0 1 auto" }}
          minW={{ sm: "250px" }}
        >
          Alle DB Inhalte (Console)
        </Button>
      </Flex>
    </Box>
  );
}
