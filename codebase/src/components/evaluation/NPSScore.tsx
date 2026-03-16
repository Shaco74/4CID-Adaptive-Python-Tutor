"use client";

import { Box, Flex, Text, VStack } from "@chakra-ui/react";

interface NPSScoreProps {
  label: string;
  description?: string;
  value: number | null;
  onChange: (value: number) => void;
  required?: boolean;
  id?: string;
  labelUnlikely?: string;
  labelVeryLikely?: string;
}

export default function NPSScore({
  label,
  description,
  value,
  onChange,
  required = false,
  id,
  labelUnlikely = "Unwahrscheinlich",
  labelVeryLikely = "Sehr wahrscheinlich",
}: NPSScoreProps) {
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
      >
        <Flex gap={2} flexWrap="wrap" justify="center">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
            <Box
              key={score}
              as="button"
              onClick={() => onChange(score)}
              minW="45px"
              h="45px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg={
                value === score
                  ? score <= 6
                    ? { base: "red.800", _light: "red.100" }
                    : score <= 8
                    ? { base: "yellow.800", _light: "yellow.100" }
                    : { base: "green.800", _light: "green.100" }
                  : { base: "gray.800", _light: "white" }
              }
              borderWidth="2px"
              borderColor={
                value === score
                  ? score <= 6
                    ? { base: "red.500", _light: "red.500" }
                    : score <= 8
                    ? { base: "yellow.500", _light: "yellow.500" }
                    : { base: "green.500", _light: "green.500" }
                  : { base: "gray.600", _light: "gray.300" }
              }
              borderRadius="md"
              fontSize="lg"
              fontWeight="bold"
              color={
                value === score
                  ? score <= 6
                    ? { base: "red.200", _light: "red.800" }
                    : score <= 8
                    ? { base: "yellow.200", _light: "yellow.800" }
                    : { base: "green.200", _light: "green.800" }
                  : { base: "gray.300", _light: "gray.700" }
              }
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: "scale(1.05)",
                borderColor: { base: "blue.400", _light: "blue.500" },
              }}
              _active={{
                transform: "scale(0.95)",
              }}
            >
              {score}
            </Box>
          ))}
        </Flex>

        <Flex justify="space-between" mt={3} px={2}>
          <Text
            fontSize="xs"
            color={{ base: "gray.500", _light: "gray.600" }}
            fontWeight="medium"
          >
            {labelUnlikely}
          </Text>
          <Text
            fontSize="xs"
            color={{ base: "gray.500", _light: "gray.600" }}
            fontWeight="medium"
          >
            {labelVeryLikely}
          </Text>
        </Flex>
      </Box>
    </VStack>
  );
}
