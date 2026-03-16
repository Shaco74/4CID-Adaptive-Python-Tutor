import { Box, Heading, Text, Flex, Button } from '@chakra-ui/react';
import React from 'react';

interface AdminEmailFormProps {
  emailSubject: string;
  setEmailSubject: (v: string) => void;
  emailMessage: string;
  setEmailMessage: (v: string) => void;
  isSendingEmail: boolean;
  onSend: () => void;
  onClose: () => void;
}

export function AdminEmailForm({ emailSubject, setEmailSubject, emailMessage, setEmailMessage, isSendingEmail, onSend, onClose }: AdminEmailFormProps) {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="rgba(0,0,0,0.7)"
      zIndex="1000"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="var(--bgAnthrazitDark)"
        color="white"
        p={6}
        borderRadius="md"
        width="90%"
        maxWidth="800px"
      >
        <Heading size="lg" mb={4}>E-Mail an Admin senden</Heading>
        <Box mb={4}>
          <Text mb={2} fontWeight="bold">Betreff</Text>
          <input
            type="text"
            value={emailSubject}
            onChange={e => setEmailSubject(e.target.value)}
            placeholder="E-Mail-Betreff eingeben"
            style={{
              backgroundColor: "black",
              border: "1px solid #4A5568",
              padding: "8px",
              width: "100%",
              borderRadius: "4px",
              color: "white"
            }}
          />
        </Box>
        <Box mb={6}>
          <Text mb={2} fontWeight="bold">Nachricht</Text>
          <textarea
            value={emailMessage}
            onChange={e => setEmailMessage(e.target.value)}
            placeholder="Geben Sie Ihre Nachricht ein"
            style={{
              backgroundColor: "black",
              border: "1px solid #4A5568",
              padding: "8px",
              width: "100%",
              height: "200px",
              borderRadius: "4px",
              color: "white"
            }}
          />
        </Box>
        <Flex justifyContent="flex-end">
          <Button
            colorScheme="green"
            mr={3}
            onClick={onSend}
            disabled={isSendingEmail}
          >
            {isSendingEmail ? 'Wird gesendet...' : 'E-Mail senden'}
          </Button>
          <Button
            onClick={onClose}
            bg="gray.700"
            _hover={{ bg: 'gray.600' }}
          >
            Abbrechen
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
