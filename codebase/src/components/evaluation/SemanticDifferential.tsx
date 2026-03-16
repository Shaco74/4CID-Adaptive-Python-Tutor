"use client";

import { Box, Flex, Text, VStack, RadioGroup } from "@chakra-ui/react";

interface SemanticPair {
  left: string;
  right: string;
  value: string;
}

interface SemanticDifferentialProps {
  label: string;
  description?: string;
  pairs: SemanticPair[];
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  required?: boolean;
  id?: string;
}

export default function SemanticDifferential({
  label,
  description,
  pairs,
  values,
  onChange,
  required = false,
  id,
}: SemanticDifferentialProps) {
  const handleChange = (pairValue: string, score: string) => {
    onChange({
      ...values,
      [pairValue]: parseInt(score),
    });
  };

  return (
    <VStack align="stretch" gap={4}>
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

      <VStack align="stretch" gap={4} id={id}>
        {pairs.map((pair) => (
          <Box
            key={pair.value}
            p={4}
            bg={{ base: "gray.900", _light: "gray.50" }}
            borderRadius="md"
            borderWidth="1px"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
          >
            <Flex justify="space-between" align="center" mb={3}>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={{ base: "gray.300", _light: "gray.700" }}
                flex="1"
              >
                {pair.left}
              </Text>
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={{ base: "gray.300", _light: "gray.700" }}
                flex="1"
                textAlign="right"
              >
                {pair.right}
              </Text>
            </Flex>

            <RadioGroup.Root
              value={values[pair.value]?.toString() || ""}
              onValueChange={(details) => handleChange(pair.value, details.value)}
            >
              <Flex justify="space-between" align="center" gap={2}>
                {[1, 2, 3, 4, 5, 6, 7].map((score) => (
                  <RadioGroup.Item
                    key={score}
                    value={score.toString()}
                    flex="1"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={1}
                    cursor="pointer"
                  >
                    <RadioGroup.ItemControl
                      w="18px"
                      h="18px"
                      borderWidth="2px"
                      borderColor={
                        values[pair.value] === score
                          ? { base: "blue.400", _light: "blue.600" }
                          : { base: "gray.600", _light: "gray.400" }
                      }
                      bg={
                        values[pair.value] === score
                          ? { base: "blue.900", _light: "blue.100" }
                          : "transparent"
                      }
                      _hover={{
                        borderColor: { base: "blue.300", _light: "blue.500" },
                      }}
                    >
                      <RadioGroup.ItemIndicator />
                    </RadioGroup.ItemControl>
                    <Text
                      fontSize="xs"
                      color={{ base: "gray.500", _light: "gray.600" }}
                    >
                      {score}
                    </Text>
                    <RadioGroup.ItemHiddenInput />
                  </RadioGroup.Item>
                ))}
              </Flex>
            </RadioGroup.Root>
          </Box>
        ))}
      </VStack>
    </VStack>
  );
}
