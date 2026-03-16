"use client";

import { Box, Container, Heading, Text, Button, VStack } from "@chakra-ui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container maxW="container.md" py={20}>
      <VStack gap={6} textAlign="center">
        <Heading size="4xl" color="gray.400">
          404
        </Heading>
        <Heading size="xl">Seite nicht gefunden</Heading>
        <Text color="gray.500">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </Text>
        <Link href="/" passHref>
          <Button colorScheme="blue">Zur Startseite</Button>
        </Link>
      </VStack>
    </Container>
  );
}
