"use client";

import { Box, Button, Container, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Error() {
  const router = useRouter();

  return (
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
            Oh, da ist etwas schiefgelaufen!
          </Heading>
          <Text fontSize="xl" color="gray.300" mb={8}>
            Es ist ein Fehler aufgetreten. Versuche es später noch einmal.
          </Text>
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={() => router.push('/')}
          >
            Zurück zum Dashboard
          </Button>
        </Flex>
      </Box>
    </Container>
  );
}
