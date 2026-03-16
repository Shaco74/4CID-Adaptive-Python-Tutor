import { Box, Flex, Text, Button } from '@chakra-ui/react';
import Editor from '@monaco-editor/react';

interface AdminEditorProps {
  userProgressData: string;
  isLoading: boolean;
  onChange: (value: string | undefined) => void;
  onSave: () => void;
  onDownload: () => void;
  isDirty: boolean;
}

export function AdminEditor({ userProgressData, isLoading, onChange, onSave, onDownload, isDirty }: AdminEditorProps) {
  return (
    <>
      <Box
        border="1px"
        borderColor="gray.600"
        borderRadius="md"
        h="50vh"
        position="relative"
        overflow="hidden"
        mb={4}
      >
        {isLoading ? (
          <Flex justify="center" align="center" h="100%">
            <Text>Wird geladen...</Text>
          </Flex>
        ) : (
          <Editor
            height="100%"
            defaultLanguage="json"
            value={userProgressData}
            onChange={onChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: "on"
            }}
            theme="vs-dark"
          />
        )}
      </Box>
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap={4}
        width="100%"
        flexWrap="wrap"
        justifyContent={{ base: "flex-start", sm: "flex-start" }}
        mb={4}
      >
        <Button
          colorScheme="blue"
          onClick={onSave}
          disabled={isLoading || !isDirty}
          size="lg"
          flex={{ base: "1 1 100%", sm: "0 1 auto" }}
          minW={{ sm: "200px" }}
          opacity={isDirty ? 1 : 0.6}
        >
          Änderungen speichern
        </Button>
        <Button
          bg="black"
          color="white"
          _hover={{ bg: 'gray.800' }}
          onClick={onDownload}
          disabled={!userProgressData}
          size="lg"
          flex={{ base: "1 1 100%", sm: "0 1 auto" }}
          minW={{ sm: "200px" }}
        >
          JSON herunterladen
        </Button>
      </Flex>
    </>
  );
}
