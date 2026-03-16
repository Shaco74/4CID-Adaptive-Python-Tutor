"use client";

import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CodePreviewProps {
  code: string;
  maxLines?: number;
  success?: boolean;
  errorMessage?: string;
}

export function CodePreview({ code, maxLines = 10, success, errorMessage }: CodePreviewProps) {
  const [expanded, setExpanded] = useState(false);

  const lines = code.split("\n");
  const hasMore = lines.length > maxLines;
  const displayCode = expanded ? code : lines.slice(0, maxLines).join("\n");

  return (
    <Box>
      <Box
        bg="gray.950"
        p={3}
        borderRadius="md"
        borderLeft="3px solid"
        borderColor={success === undefined ? "gray.600" : success ? "green.500" : "red.500"}
        fontFamily="mono"
        fontSize="xs"
        overflowX="auto"
      >
        <Text color="gray.300" whiteSpace="pre-wrap" wordBreak="break-word">
          {displayCode}
        </Text>
        {hasMore && (
          <Box
            as="button"
            onClick={() => setExpanded(!expanded)}
            display="flex"
            alignItems="center"
            gap={1}
            color="gray.500"
            fontSize="xs"
            mt={2}
            cursor="pointer"
            _hover={{ color: "gray.300" }}
          >
            {expanded ? (
              <>
                <ChevronUp size={14} />
                Weniger anzeigen
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                +{lines.length - maxLines} weitere Zeilen anzeigen
              </>
            )}
          </Box>
        )}
      </Box>
      {errorMessage && (
        <Box mt={2} p={2} bg="red.900/30" borderRadius="md">
          <Text color="red.300" fontSize="xs" fontFamily="mono">
            Error: {errorMessage}
          </Text>
        </Box>
      )}
    </Box>
  );
}
