import { useState } from "react";
import { 
  Box, 
  Button, 
  Flex, 
  Heading, 
  Text
} from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { sendAdminEmail } from '@/actions/emailActions';
import { saveUserConfig } from '@/actions/userConfigActions';

interface SendUserConfigButtonProps {
  userId: string;
  configData: string;
}

const SendUserConfigButton: React.FC<SendUserConfigButtonProps> = ({ userId, configData }) => {
  const [showModal, setShowModal] = useState(false);
  const [emailBody, setEmailBody] = useState(
    `Hallo,\n\nAnbei finden Sie die Benutzerkonfiguration für Benutzer-ID: ${userId}.\n\nMit freundlichen Grüßen,\nPython Bootcamp Admin`
  );
  const [isSending, setIsSending] = useState(false);

  // Email subject is fixed based on the user ID
  const emailSubject = `Benutzerkonfiguration für ${userId}`;

  const handleSendConfig = async () => {
    if (!configData) {
      toaster.create({
        title: "Keine Daten zum Senden",
        description: "Es gibt keine Benutzerkonfigurationsdaten zum Senden",
        type: "warning",
        duration: 3000,
      });
      return;
    }
    
    try {
      setIsSending(true);
      
      // First save the file to the server temporarily
      // Use server action to save the file to the server temporarily
      const saveResult = await saveUserConfig({ userId, configData });
      if (!saveResult.success || !saveResult.filePath) {
        throw new Error(saveResult.error || 'Fehler beim Speichern der Konfiguration');
      }
      const filePath = saveResult.filePath;
      
      // Now send the email with the attachment using the server action
      const result = await sendAdminEmail({
        subject: emailSubject,
        message: emailBody,
        attachmentPath: filePath,
        attachmentName: `user-config-${userId}.json`
      });

      if (!result.success) {
        throw new Error(result.error || 'Fehler beim Senden der E-Mail');
      }
      
      // Close modal and show success message
      setShowModal(false);
      setEmailBody(`Hallo,\n\nAnbei finden Sie die Benutzerkonfiguration für Benutzer-ID: ${userId}.\n\nMit freundlichen Grüßen,\nPython Bootcamp Admin`);
      
      toaster.create({
        title: "Konfiguration gesendet",
        description: "Benutzerkonfiguration wurde erfolgreich gesendet",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Error sending configuration:", err);
      
      toaster.create({
        title: "Fehler beim Senden der Konfiguration",
        description: err instanceof Error ? err.message : "Fehler beim Senden der Konfiguration",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button 
        colorScheme="teal"
        onClick={() => setShowModal(true)}
        size="lg"
        flex={{ base: "1 1 100%", sm: "0 1 auto" }}
        minW={{ sm: "150px" }}
        mt={{ base: 2, sm: 0 }}
      >
        Benutzerkonfig senden
      </Button>
      
      {/* Modal for sending config */}
      {showModal && (
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
            <Heading size="lg" mb={4}>Benutzerkonfiguration senden</Heading>
            
            <Box mb={4}>
              <Text mb={2} fontWeight="bold">Betreff (Schreibgeschützt)</Text>
              <input
                type="text"
                value={emailSubject}
                readOnly
                style={{
                  backgroundColor: "#1A202C",
                  border: "1px solid #4A5568",
                  padding: "8px",
                  width: "100%",
                  borderRadius: "4px",
                  color: "white",
                  opacity: 0.8
                }}
              />
            </Box>

            <Box mb={6}>
              <Text mb={2} fontWeight="bold">Nachricht</Text>
              <textarea
                value={emailBody}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEmailBody(e.target.value)}
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
              <Text fontSize="sm" color="gray.400" mt={1}>
                Die Benutzerkonfiguration wird dieser E-Mail automatisch beigefügt.
              </Text>
            </Box>

            <Flex justifyContent="flex-end">
              <Button 
                colorScheme="teal" 
                mr={3} 
                onClick={handleSendConfig}
                disabled={isSending}
              >
                {isSending ? 'Wird gesendet...' : 'Konfiguration senden'}
              </Button>
              <Button 
                onClick={() => setShowModal(false)}
                bg="gray.700"
                _hover={{ bg: 'gray.600' }}
              >
                Abbrechen
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SendUserConfigButton;
