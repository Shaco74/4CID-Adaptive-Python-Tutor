"use client";

import { useEffect } from "react";
import { Box, Button, Container, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useTranslations } from "next-intl";

export default function AufWiedersehenPage() {
  const t = useTranslations("goodbye");

  useEffect(() => {
    document.title = "Python Bootcamp - Goodbye";
  }, []);

  return (
    <AuthGuard>
      <Container maxW="container.md" py={16} bg={{ base: "gray.900", _light: "gray.50" }} minH="100vh">
        <VStack gap={8} align="stretch">
          {/* Thank You Header */}
          <Box
            textAlign="center"
            py={12}
            px={6}
            bg={{ base: "blue.800", _light: "blue.50" }}
            borderRadius="xl"
            boxShadow="2xl"
            borderWidth="2px"
            borderColor={{ base: "blue.600", _light: "blue.300" }}
          >
            <Text fontSize="6xl" mb={4}>🙏</Text>
            <Heading as="h1" size="2xl" color={{ base: "white", _light: "gray.900" }} mb={6}>
              {t("title")}
            </Heading>
            <Text fontSize="xl" color={{ base: "blue.200", _light: "blue.800" }} lineHeight="tall">
              {t("subtitle")}
            </Text>
          </Box>

          {/* Personal Thank You Message */}
          <Box
            py={8}
            px={6}
            bg={{ base: "gray.800", _light: "white" }}
            borderRadius="lg"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
          >
            <VStack gap={6} align="stretch">
              <Text fontSize="lg" color={{ base: "gray.300", _light: "gray.700" }} lineHeight="tall">
                {t("greeting")}
              </Text>

              <Text fontSize="lg" color={{ base: "gray.300", _light: "gray.700" }} lineHeight="tall">
                {t("paragraph1")}
              </Text>

              <Text fontSize="lg" color={{ base: "gray.300", _light: "gray.700" }} lineHeight="tall">
                {t("paragraph2")}
              </Text>

              <Box
                py={4}
                px={6}
                bg={{ base: "purple.900", _light: "purple.50" }}
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor={{ base: "purple.400", _light: "purple.500" }}
              >
                <Text fontSize="md" color={{ base: "purple.200", _light: "purple.800" }} fontWeight="medium">
                  {t("youAreAwesome")}
                </Text>
                <Text fontSize="sm" color={{ base: "purple.300", _light: "purple.700" }} mt={2}>
                  {t("wishesMessage")}
                </Text>
              </Box>

              <Text fontSize="lg" color={{ base: "gray.300", _light: "gray.700" }} lineHeight="tall" fontWeight="medium">
                {t("closing")}
              </Text>

              <Text fontSize="lg" color={{ base: "gray.400", _light: "gray.600" }} lineHeight="tall" fontStyle="italic">
                {t("signature")}
              </Text>
            </VStack>
          </Box>

          {/* Closing Message */}
          <Box
            py={6}
            px={6}
            bg={{ base: "gray.800", _light: "white" }}
            borderRadius="lg"
            boxShadow="md"
            borderWidth="1px"
            borderColor={{ base: "gray.700", _light: "gray.200" }}
            textAlign="center"
          >
            <Text fontSize="md" color={{ base: "gray.400", _light: "gray.600" }} mb={4}>
              {t("closeInfo")}
            </Text>
            <Flex justify="center" gap={4}>
              <Link href="/" passHref>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="lg"
                  px={8}
                >
                  {t("backToHome")}
                </Button>
              </Link>
            </Flex>
          </Box>
        </VStack>
      </Container>
    </AuthGuard>
  );
}
