"use client";

import { Box, Flex, Text, VStack, Slider } from "@chakra-ui/react";

interface RatingSliderProps {
  label: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  leftLabel?: string;
  rightLabel?: string;
  stepLabels?: string[];
  required?: boolean;
  id?: string;
}

export default function RatingSlider({
  label,
  description,
  value,
  onChange,
  min = 1,
  max = 10,
  step = 1,
  showValue = true,
  leftLabel,
  rightLabel,
  stepLabels,
  required = false,
  id,
}: RatingSliderProps) {
  const currentStepLabel = stepLabels ? stepLabels[value - min] : null;
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

      <Flex align="center" gap={4} px={2}>
        <Box flex="1">
          <Slider.Root
            id={id}
            min={min}
            max={max}
            step={step}
            value={[value]}
            onValueChange={(details) => onChange(details.value[0])}
          >
            <Slider.Label srOnly>{label}</Slider.Label>
            <Slider.Control>
              <Slider.Track
                bg={{ base: "gray.700", _light: "gray.300" }}
                h="10px"
                borderRadius="full"
              >
                <Slider.Range bg={{ base: "blue.500", _light: "blue.600" }} />
              </Slider.Track>
              <Slider.Thumb
                index={0}
                boxSize="26px"
                bg={{ base: "blue.500", _light: "blue.600" }}
                borderWidth="4px"
                borderColor={{ base: "gray.800", _light: "white" }}
                boxShadow="lg"
                _hover={{
                  transform: "scale(1.15)",
                }}
                _focus={{
                  boxShadow: "0 0 0 4px rgba(66, 153, 225, 0.3)",
                }}
              />
            </Slider.Control>
          </Slider.Root>
        </Box>
        {showValue && (
          <Box
            minW="50px"
            textAlign="center"
            py={2}
            px={3}
            bg={{ base: "blue.900", _light: "blue.50" }}
            borderRadius="md"
            borderWidth="2px"
            borderColor={{ base: "blue.600", _light: "blue.300" }}
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              color={{ base: "blue.300", _light: "blue.700" }}
            >
              {value}
            </Text>
          </Box>
        )}
      </Flex>

      {stepLabels ? (
        <VStack gap={2} px={2} mt={1}>
          {currentStepLabel && (
            <Box
              py={2}
              px={4}
              bg={{ base: "blue.900", _light: "blue.50" }}
              borderRadius="md"
              borderWidth="1px"
              borderColor={{ base: "blue.600", _light: "blue.300" }}
              w="100%"
              textAlign="center"
            >
              <Text
                fontSize="md"
                fontWeight="semibold"
                color={{ base: "blue.200", _light: "blue.700" }}
              >
                {currentStepLabel}
              </Text>
            </Box>
          )}
          <Flex justify="space-between" w="100%">
            {stepLabels.map((_, index) => (
              <Text
                key={index}
                fontSize="xs"
                color={
                  value === min + index
                    ? { base: "blue.300", _light: "blue.600" }
                    : { base: "gray.500", _light: "gray.500" }
                }
                fontWeight={value === min + index ? "bold" : "normal"}
                textAlign="center"
                flex="1"
              >
                {min + index}
              </Text>
            ))}
          </Flex>
        </VStack>
      ) : (leftLabel || rightLabel) && (
        <Flex justify="space-between" px={2} mt={1}>
          {leftLabel && (
            <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} fontWeight="medium">
              {leftLabel}
            </Text>
          )}
          {rightLabel && (
            <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} fontWeight="medium">
              {rightLabel}
            </Text>
          )}
        </Flex>
      )}
    </VStack>
  );
}
