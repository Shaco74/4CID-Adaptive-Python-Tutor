"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@chakra-ui/react/native-select";
import { useTranslations } from "next-intl";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectDropdownProps {
  label: string;
  description?: string;
  value: string | null;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  id?: string;
}

export default function SelectDropdown({
  label,
  description,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  id,
}: SelectDropdownProps) {
  const t = useTranslations('course');
  const defaultPlaceholder = placeholder ?? t('selectPlaceholder');
  return (
    <VStack align="stretch" gap={3}>
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

      <NativeSelectRoot
        size="lg"
        variant="outline"
      >
        <NativeSelectField
          id={id}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={defaultPlaceholder}
          bg={{ base: "gray.800", _light: "white" }}
          borderWidth="2px"
          borderColor={{ base: "gray.600", _light: "gray.300" }}
          color={{ base: "white", _light: "gray.900" }}
          _hover={{
            borderColor: { base: "blue.400", _light: "blue.500" },
          }}
          _focus={{
            borderColor: { base: "blue.500", _light: "blue.600" },
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
          }}
          borderRadius="md"
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              style={{ background: "#1a202c", color: "white" }}
            >
              {option.label}
            </option>
          ))}
        </NativeSelectField>
      </NativeSelectRoot>
    </VStack>
  );
}
