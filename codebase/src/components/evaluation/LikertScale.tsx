"use client";

import { Box, Flex, Text, VStack, RadioGroup } from "@chakra-ui/react";

interface LikertScaleProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  scale?: 3 | 5 | 7;
  required?: boolean;
  id?: string;
}

const SCALE_OPTIONS = {
  3: [
    { value: "1", label: "Stimme nicht zu" },
    { value: "2", label: "Neutral" },
    { value: "3", label: "Stimme zu" },
  ],
  5: [
    { value: "1", label: "Stimme gar nicht zu" },
    { value: "2", label: "Stimme nicht zu" },
    { value: "3", label: "Neutral" },
    { value: "4", label: "Stimme zu" },
    { value: "5", label: "Stimme voll zu" },
  ],
  7: [
    { value: "1", label: "Stimme gar nicht zu" },
    { value: "2", label: "Stimme nicht zu" },
    { value: "3", label: "Stimme eher nicht zu" },
    { value: "4", label: "Neutral" },
    { value: "5", label: "Stimme eher zu" },
    { value: "6", label: "Stimme zu" },
    { value: "7", label: "Stimme voll zu" },
  ],
};

export default function LikertScale({
  label,
  description,
  value,
  onChange,
  scale = 5,
  required = false,
  id,
}: LikertScaleProps) {
  const options = SCALE_OPTIONS[scale];

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
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          flexWrap="wrap"
          justify="space-between"
        >
          {options.map((option) => (
            <RadioGroup.Item
              key={option.value}
              value={option.value}
              flex={{ base: "1", md: scale === 3 ? "1" : "0 1 auto" }}
              p={3}
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
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: { base: "blue.400", _light: "blue.500" },
                bg: { base: "gray.750", _light: "gray.50" },
              }}
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
              <RadioGroup.ItemText
                fontSize="sm"
                fontWeight="medium"
                color={
                  value === option.value
                    ? { base: "blue.200", _light: "blue.800" }
                    : { base: "gray.300", _light: "gray.700" }
                }
                ml={2}
              >
                {option.label}
              </RadioGroup.ItemText>
              <RadioGroup.ItemHiddenInput />
            </RadioGroup.Item>
          ))}
        </Flex>
      </RadioGroup.Root>
    </VStack>
  );
}
