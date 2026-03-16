"use client";

import { Box, Text, VStack } from "@chakra-ui/react";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxOption {
  value: string;
  label: string;
  description?: string;
}

interface CheckboxListProps {
  label: string;
  description?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: CheckboxOption[];
  required?: boolean;
  id?: string;
}

export default function CheckboxList({
  label,
  description,
  value,
  onChange,
  options,
  required = false,
  id,
}: CheckboxListProps) {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v) => v !== optionValue));
    }
  };

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

      <VStack align="stretch" gap={2} id={id}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={value.includes(option.value)}
            onCheckedChange={(details) =>
              handleCheckboxChange(option.value, details.checked === true)
            }
            p={3}
            borderRadius="md"
            borderWidth="1px"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
            bg={{ base: "gray.900", _light: "white" }}
            _hover={{
              bg: { base: "gray.800", _light: "gray.50" },
              borderColor: { base: "gray.600", _light: "gray.300" },
            }}
            cursor="pointer"
            transition="all 0.2s"
          >
            <Box ml={2}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={{ base: "white", _light: "gray.900" }}
              >
                {option.label}
              </Text>
              {option.description && (
                <Text
                  fontSize="xs"
                  color={{ base: "gray.400", _light: "gray.600" }}
                  mt={1}
                >
                  {option.description}
                </Text>
              )}
            </Box>
          </Checkbox>
        ))}
      </VStack>
    </VStack>
  );
}
