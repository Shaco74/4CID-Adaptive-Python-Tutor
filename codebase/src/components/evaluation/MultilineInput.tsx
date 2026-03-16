"use client";

import { useState, useEffect } from "react";
import { Box, Textarea, Text, VStack } from "@chakra-ui/react";

interface MultilineInputProps {
  label: string;
  description?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  maxLength?: number;
  required?: boolean;
  id?: string;
}

export default function MultilineInput({
  label,
  description,
  placeholder = "Deine Antwort...",
  value,
  onChange,
  rows = 4,
  maxLength,
  required = false,
  id,
}: MultilineInputProps) {
  // Use local state for smooth typing, sync to parent on blur
  const [localValue, setLocalValue] = useState(value);

  // Sync local state when parent value changes (e.g., reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    // Only update parent if value changed
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  return (
    <VStack align="stretch" gap={2}>
      <Box>
        <Text
          fontSize="md"
          fontWeight="semibold"
          color={{ base: "white", _light: "gray.900" }}
        >
          {label}
          {required && (
            <Text as="span" color="red.400" ml={1}>
              *
            </Text>
          )}
        </Text>
        {description && (
          <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} mt={1}>
            {description}
          </Text>
        )}
      </Box>

      <Textarea
        id={id}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        bg={{ base: "gray.900", _light: "white" }}
        borderColor={{ base: "gray.600", _light: "gray.300" }}
        color={{ base: "white", _light: "gray.900" }}
        _placeholder={{ color: { base: "gray.500", _light: "gray.400" } }}
        _hover={{
          borderColor: { base: "gray.500", _light: "gray.400" },
        }}
        _focus={{
          borderColor: { base: "blue.400", _light: "blue.500" },
          boxShadow: "0 0 0 1px var(--chakra-colors-blue-400)",
        }}
        resize="vertical"
      />

      {maxLength && (
        <Text
          fontSize="xs"
          color={{ base: "gray.500", _light: "gray.500" }}
          textAlign="right"
        >
          {localValue.length} / {maxLength}
        </Text>
      )}
    </VStack>
  );
}
