"use client";

import { Box, Text, VStack, RadioGroup } from "@chakra-ui/react";

interface MultipleChoiceOption {
  value: string;
  label: string;
  description?: string;
}

interface MultipleChoiceProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: MultipleChoiceOption[];
  required?: boolean;
  id?: string;
}

export default function MultipleChoice({
  label,
  description,
  value,
  onChange,
  options,
  required = false,
  id,
}: MultipleChoiceProps) {
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

      <RadioGroup.Root
        id={id}
        value={value}
        onValueChange={(details) => onChange(details.value)}
      >
        <VStack align="stretch" gap={2}>
          {options.map((option) => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              p={4}
              borderRadius="md"
              borderWidth="2px"
              borderColor={
                value === option.value
                  ? { base: "blue.500", _light: "blue.600" }
                  : { base: "gray.600", _light: "gray.300" }
              }
              bg={
                value === option.value
                  ? { base: "blue.900", _light: "blue.50" }
                  : { base: "gray.800", _light: "white" }
              }
              _hover={{
                bg: {
                  base: value === option.value ? "blue.800" : "gray.750",
                  _light: value === option.value ? "blue.100" : "gray.50",
                },
                borderColor: { base: "blue.400", _light: "blue.500" },
              }}
              cursor="pointer"
              transition="all 0.2s"
            >
              <RadioGroup.ItemControl
                w="20px"
                h="20px"
                borderWidth="2px"
                borderColor={
                  value === option.value
                    ? { base: "blue.400", _light: "blue.600" }
                    : { base: "gray.500", _light: "gray.400" }
                }
              >
                <RadioGroup.ItemIndicator />
              </RadioGroup.ItemControl>
              <Box ml={3} flex="1">
                <RadioGroup.ItemText
                  fontSize="sm"
                  fontWeight="medium"
                  color={
                    value === option.value
                      ? { base: "blue.200", _light: "blue.800" }
                      : { base: "white", _light: "gray.900" }
                  }
                >
                  {option.label}
                </RadioGroup.ItemText>
                {option.description && (
                  <Text
                    fontSize="xs"
                    color={
                      value === option.value
                        ? { base: "blue.300", _light: "blue.700" }
                        : { base: "gray.400", _light: "gray.600" }
                    }
                    mt={1}
                  >
                    {option.description}
                  </Text>
                )}
              </Box>
              <RadioGroup.ItemHiddenInput />
            </RadioGroup.Item>
          ))}
        </VStack>
      </RadioGroup.Root>
    </VStack>
  );
}
