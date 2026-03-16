"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Stack} from "@chakra-ui/react";
import AuthGuard from "@/components/AuthGuard";
import SendUserConfigButton from "@/components/SendUserConfigButton";
import { AdminHeader } from "./components/AdminHeader";
import { AdminNav } from "./components/AdminNav";
import { UserSelector } from "./components/UserSelector";
import { AdminEditor } from "./components/AdminEditor";
import { AdminDebugTools } from "./components/AdminDebugTools";
import { AdminEmailForm } from "./components/AdminEmailForm";
import { ErrorMessageBox } from "./components/ErrorMessageBox";
import { Toaster } from "@/components/ui/toaster";
import {
  showUserNotFoundToast,
  showAdminSaveSuccessToast,
  showAdminSaveErrorToast,
  showAdminEmailMissingToast,
  showAdminEmailSentToast,
  showAdminEmailErrorToast,
  showAdminDownloadErrorToast,
  showAdminListUsersToast,
  showAdminListUsersErrorToast,
  showAdminListConfigsToast,
  showAdminListConfigsErrorToast
} from '@/util/hooks/useStandardToaster';
import { getAllUsers, getAllUserConfigs, getUserConfig, modifyUserConfig } from "@/db/utils";
import { sendAdminEmail } from "@/actions/emailActions";

const AdminDashboardPage = () => {
  const [userProgressData, setUserProgressData] = useState<string>("");
  const [originalData, setOriginalData] = useState<string>("");
  const [isDirty, setIsDirty] = useState(false);
  const [userIds, setUserIds] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Python Bootcamp - Admin";
  }, []);

  // Email functionality
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Load all user progress data
  const loadAllData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Get all user configs directly from the database
      const allUserConfigs = await getAllUserConfigs();
      // // console.log('AdminUserProgress: loaded all user configs');

      const allData = allUserConfigs.map(item => ({
        id: item.userId,
        ...item.data
      }));

      const formattedData = JSON.stringify(allData, null, 2);
      setUserProgressData(formattedData);
      setOriginalData(formattedData);
      setIsDirty(false);

      // Extract user IDs for the dropdown
      const ids = allData.map(item => item.id);
      setUserIds(ids);

      if (ids.length > 0 && !selectedUserId) {
        setSelectedUserId(ids[0]);
      }

      setError(null);
    } catch (err) {
      console.error("Error loading user progress data:", err);
      setError("Failed to load user progress data");
    } finally {
      setIsLoading(false);
    }
  }, [selectedUserId]);

  // Load specific user data
  const loadUserData = async (userId: string) => {
    if (!userId) return;
    // // console.log(`[Admin] Loading user data for userId: ${userId}`);

    try {
      setIsLoading(true);

      // Get user config directly from the database
      const userData = await getUserConfig(userId);
      // // console.log(`[Admin] Fetching user data directly from database`);

      if (!userData) {
        // // console.log(`[Admin] User not found: ${userId}`);
        setUserProgressData("");
        showUserNotFoundToast(userId);
        return;
      }

      // Add the ID to the user data for consistency
      const userDataWithId = {
        id: userId,
        ...userData
      };

      // // console.log(`[Admin] Received user data:`, userDataWithId);

      const formattedData = JSON.stringify(userDataWithId, null, 2);
      // // console.log(`[Admin] Formatted data length: ${formattedData.length} characters`);

      setUserProgressData(formattedData);
      setOriginalData(formattedData);
      setIsDirty(false);
      setError(null);
    } catch (err) {
      console.error(`Error loading data for user ${userId}:`, err);
      setError(`Failed to load data for user ${userId}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    try {
      // Parse the current editor content
      const parsedData = JSON.parse(userProgressData);

      // Extract userId and prepare data for saving
      const userId = parsedData.id;

      if (!userId) {
        throw new Error('User ID is missing in the data');
      }

      // Remove the id field before saving to match the UserConfig type
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, ...dataToSave } = parsedData;

      // Update the user config directly in the database
      await modifyUserConfig(userId, dataToSave);

      showAdminSaveSuccessToast();

      // Update original data to match current data
      setOriginalData(userProgressData);
      setIsDirty(false);

      // Reload data to reflect changes
      if (selectedUserId === userId) {
        await loadUserData(userId);
      } else {
        await loadAllData();
      }
    } catch (err) {
      console.error("Error saving changes:", err);

      showAdminSaveErrorToast(err instanceof Error ? err.message : undefined);
    }
  };

  // Handle editor change
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setUserProgressData(value);
      // Check if the current data is different from the original data
      setIsDirty(value !== originalData);
    }
  };

  // Send email to admin
  const handleSendEmail = async () => {
    if (!emailSubject || !emailMessage) {
      showAdminEmailMissingToast();
      return;
    }

    try {
      setIsSendingEmail(true);

      // Call emailService directly instead of making a fetch call
      const result = await sendAdminEmail({
        subject: emailSubject,
        message: emailMessage
      });

      if (!result.success) {
        throw new Error(result.error || 'Fehler beim Senden der E-Mail');
      }

      // Clear form
      setEmailSubject("");
      setEmailMessage("");

      // Close form
      setShowEmailForm(false);

      showAdminEmailSentToast();
    } catch (err) {
      console.error("Error sending email:", err);

      showAdminEmailErrorToast(err instanceof Error ? err.message : undefined);
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Download JSON file
  const handleDownload = () => {
    try {
      // Validate JSON before download
      JSON.parse(userProgressData);

      // Create a blob with the data
      const blob = new Blob([userProgressData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;

      // Set filename based on user ID or generic name
      const filename = selectedUserId
        ? `user-progress-${selectedUserId}.json`
        : 'all-user-progress.json';

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading JSON:", err);

      showAdminDownloadErrorToast();
    }
  };

  // List all JSON files in DB directory
  const handleListJsonFiles = async () => {
    try {
      // // console.log("Fetching list of users from database...");
      const userIds = await getAllUsers();

      // // console.log("All users in database:", userIds);

      showAdminListUsersToast(userIds.length);
    } catch (err) {
      console.error("Error listing users:", err);

      showAdminListUsersErrorToast(err instanceof Error ? err.message : undefined);
    }
  };

  // Get all user configs and display them in the console
  const handleGetAllJsonContents = async () => {
    try {
      // // console.log("Fetching all user configs from database...");
      const allUserConfigs = await getAllUserConfigs();

      const allUserData = allUserConfigs.map(item => ({
        id: item.userId,
        ...item.data
      }));

      const jsonString = JSON.stringify(allUserData, null, 2);
      // // console.log("All user configs:", allUserData);

      showAdminListConfigsToast(jsonString.length);
    } catch (err) {
      console.error("Error getting user configs:", err);

      showAdminListConfigsErrorToast(err instanceof Error ? err.message : undefined);
    }
  };

  // Load usernames for the dropdown on initial render
  useEffect(() => {
    const loadUsernames = async () => {
      try {
        setIsLoading(true);

        // Get all usernames from the database
        const usernames = await getAllUsers();
        // // console.log('Admin: loaded all user IDs');

        setUserIds(usernames);

        // Select first user by default if available
        if (usernames.length > 0 && !selectedUserId) {
          setSelectedUserId(usernames[0]);
        }

        setError(null);
      } catch (err) {
        console.error("Error loading user IDs:", err);
        setError("Failed to load user IDs");
      } finally {
        setIsLoading(false);
      }
    };

    loadUsernames();
    // !hier soll nur einmal gerendert werden bei onmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user data when selected user changes
  useEffect(() => {
    if (selectedUserId) {
      loadUserData(selectedUserId);
    }
  }, [selectedUserId]);

  return (
    <AuthGuard requireAdmin={true}>
      <Toaster />
      <Box
        py="8"
        px={{ base: '4', sm: '10' }}
        bg="var(--bgAnthrazitDark)"
        boxShadow="xl"
        borderRadius="lg"
        color="white"
      >
        <AdminHeader />
        <AdminNav />
        <Stack direction="column" gap={4} width="100%">
          <Flex
            direction={{ base: "column", md: "row" }}
            gap={4}
            width="100%"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems={{ base: "flex-start", md: "center" }}
            mb={4}
          >
            <UserSelector
              userIds={userIds}
              selectedUserId={selectedUserId}
              setSelectedUserId={setSelectedUserId}
              onShowAll={loadAllData}
            />
            <Flex
              direction={{ base: "column", sm: "row" }}
              gap={4}
              flex={{ base: "1 1 100%", md: "0 1 auto" }}
              justifyContent={{ base: "flex-start", md: "flex-end" }}
              mt={{ base: 2, md: 0 }}
            >
              <Button
                colorScheme="green"
                onClick={() => setShowEmailForm(true)}
                size="lg"
                flex={{ base: "1 1 100%", sm: "0 1 auto" }}
                minW={{ sm: "180px" }}
              >
                E-Mail senden
              </Button>
              {selectedUserId && (
                <SendUserConfigButton
                  userId={selectedUserId}
                  configData={userProgressData}
                />
              )}
            </Flex>
          </Flex>
          <ErrorMessageBox error={error} />
          <AdminEditor
            userProgressData={userProgressData}
            isLoading={isLoading}
            onChange={handleEditorChange}
            onSave={handleSaveChanges}
            onDownload={handleDownload}
            isDirty={isDirty}
          />
          <AdminDebugTools
            onListJsonFiles={handleListJsonFiles}
            onGetAllJsonContents={handleGetAllJsonContents}
          />
        </Stack>
      </Box>
      {showEmailForm && (
        <AdminEmailForm
          emailSubject={emailSubject}
          setEmailSubject={setEmailSubject}
          emailMessage={emailMessage}
          setEmailMessage={setEmailMessage}
          isSendingEmail={isSendingEmail}
          onSend={handleSendEmail}
          onClose={() => setShowEmailForm(false)}
        />
      )}
    </AuthGuard>
  );
};

export default AdminDashboardPage;
