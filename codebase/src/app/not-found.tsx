"use client";

import { Box, Button, Container, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Provider } from "@/components/ui/provider";

export default function NotFound() {
  const router = useRouter();

  return (
    <Provider>
      <Container maxW="container.xl" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }} bg="var(--bgAnthrazit)">
        <Box
          py="8"
          px={{ base: '4', sm: '10' }}
          bg="var(--bgAnthrazitDark)"
          boxShadow="xl"
          borderRadius="lg"
          color="white"
        >
          <Flex direction="column" alignItems="center" textAlign="center">
            <Image
              src="/python-logo.png"
              alt="Python Logo"
              boxSize="150px"
              mb={6}
            />
            <Heading size="2xl" mb={4}>
              Page not found
            </Heading>
            <Text fontSize="xl" color="gray.300" mb={8}>
              This page does not exist or you do not have permission to view it.
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => router.push('/')}
            >
              Back to Dashboard
            </Button>
          </Flex>
        </Box>
      </Container>
    </Provider>
  );
}
