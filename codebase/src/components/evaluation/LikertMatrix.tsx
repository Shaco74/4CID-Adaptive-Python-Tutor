"use client";

import { Box, Flex, Text, VStack, RadioGroup } from "@chakra-ui/react";

interface MatrixItem {
  id: string;
  statement: string;
}

interface LikertMatrixProps {
  label: string;
  description?: string;
  items: MatrixItem[];
  values: Record<string, number>;
  onChange: (values: Record<string, number>) => void;
  scale?: {
    min: number;
    max: number;
    minLabel: string;
    maxLabel: string;
  };
  required?: boolean;
  id?: string;
}

export default function LikertMatrix({
  label,
  description,
  items,
  values,
  onChange,
  scale = {
    min: 1,
    max: 5,
    minLabel: "Stimme nicht zu",
    maxLabel: "Stimme zu",
  },
  required = false,
  id,
}: LikertMatrixProps) {
  const handleChange = (itemId: string, score: string) => {
    onChange({
      ...values,
      [itemId]: parseInt(score),
    });
  };

  const scaleValues = Array.from(
    { length: scale.max - scale.min + 1 },
    (_, i) => scale.min + i
  );

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

      <Box
        id={id}
        p={4}
        bg={{ base: "gray.900", _light: "gray.50" }}
        borderRadius="md"
        borderWidth="1px"
        borderColor={{ base: "gray.700", _light: "gray.200" }}
        overflowX="auto"
      >
        {/* Header */}
        <Flex gap={2} mb={3} display={{ base: "none", md: "flex" }}>
          <Box flex="1" minW="200px" />
          <Flex flex="1" justify="space-between" align="center" minW="300px">
            <Text
              fontSize="xs"
              color={{ base: "gray.500", _light: "gray.600" }}
              fontWeight="medium"
              flex="1"
            >
              {scale.minLabel}
            </Text>
            <Text
              fontSize="xs"
              color={{ base: "gray.500", _light: "gray.600" }}
              fontWeight="medium"
              flex="1"
              textAlign="right"
            >
              {scale.maxLabel}
            </Text>
          </Flex>
        </Flex>

        {/* Items */}
        <VStack align="stretch" gap={3}>
          {items.map((item, index) => (
            <Box
              key={item.id}
              p={3}
              bg={
                index % 2 === 0
                  ? { base: "gray.800", _light: "white" }
                  : { base: "gray.850", _light: "gray.100" }
              }
              borderRadius="md"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={3}
                align={{ base: "stretch", md: "center" }}
              >
                <Text
                  fontSize="sm"
                  color={{ base: "gray.200", _light: "gray.800" }}
                  flex="1"
                  minW={{ base: "auto", md: "200px" }}
                >
                  {item.statement}
                </Text>

                <RadioGroup.Root
                  value={values[item.id]?.toString() || ""}
                  onValueChange={(details) => handleChange(item.id, details.value)}
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    gap={2}
                    flex="1"
                    minW={{ base: "auto", md: "300px" }}
                  >
                    {scaleValues.map((score) => (
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
                          w="20px"
                          h="20px"
                          borderWidth="2px"
                          borderColor={
                            values[item.id] === score
                              ? { base: "blue.400", _light: "blue.600" }
                              : { base: "gray.600", _light: "gray.400" }
                          }
                          bg={
                            values[item.id] === score
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
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
}
