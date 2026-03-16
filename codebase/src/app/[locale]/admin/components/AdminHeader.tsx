import { Flex, Heading, Text, Stack, Image } from '@chakra-ui/react';

export function AdminHeader() {
  return (
    <Stack direction="column" alignItems="center" mb={6}>
      <Flex alignItems="center" justifyContent="center" mb={2}>
        <Image
          src="/python-logo.png"
          alt="Python Bootcamp Logo"
          height="40px"
          width="auto"
          mr={3}
        />
        <Heading size="xl">
          Python Bootcamp Admin-Dashboard
        </Heading>
      </Flex>
      <Text fontSize="lg" color="gray.300" textAlign="center">
        Benutzerfortschrittsdaten anzeigen, bearbeiten und herunterladen
      </Text>
    </Stack>
  );
}
