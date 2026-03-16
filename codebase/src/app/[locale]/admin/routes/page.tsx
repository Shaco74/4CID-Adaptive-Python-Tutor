"use client";

import React from "react";
import { Box, Heading, Stack, Text, Code, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { AdminNav } from "../components/AdminNav";
import AuthGuard from "@/components/AuthGuard";

const routes = [
  { path: "/", name: "Home" },
  { path: "/login", name: "Login" },
  { path: "/onboarding", name: "Onboarding" },
  { path: "/pfade/bmi-calculator/1", name: "BMI Calculator - Steps" },
  { path: "/pfade/interest-calculator/1", name: "Interest Calculator - Steps" },
  { path: "/pfade/password-generator/1", name: "Password Generator (Archived)" },
  { path: "/drills-demo-v1", name: "Drills Demo V1 (Active - Topic-based)" },
  { path: "/drills-demo-v2", name: "Drills Demo V2 (Planned - Step-based)" },
  { path: "/evaluation", name: "Evaluation" },
  { path: "/admin", name: "Admin Dashboard" },
  { path: "/admin/user-metrics-v2", name: "Admin - User Metrics" },
  { path: "/admin/routes", name: "Admin - Routes (this page)" },
  { path: "/admin/course-tags", name: "Admin - Course Tags" },
  { path: "/auf-wiedersehen", name: "Goodbye" },
];

export default function AdminRoutesPage() {
  React.useEffect(() => {
    document.title = "Python Bootcamp - Admin Routes";
  }, []);

  return (
    <AuthGuard requireAdmin={true}>
      <Box
        py="8"
        px={{ base: "4", sm: "10" }}
        bg="var(--bgAnthrazitDark)"
        minH="100vh"
        color="white"
      >
        <VStack align="stretch" gap={6} maxW="900px" mx="auto">
          <AdminNav />
          <Heading size="2xl" mb={2}>
          All Routes
        </Heading>
        <Text color="gray.400">
          Übersicht aller verfügbaren Routen in der Applikation
        </Text>

        <Stack gap={3}>
          {routes.map((route) => (
            <Box
              key={route.path}
              p={4}
              bg="gray.800"
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.700"
              _hover={{ bg: "gray.700", borderColor: "blue.500" }}
              transition="all 0.2s"
            >
              <Link href={route.path}>
                <VStack align="start" gap={1}>
                  <Text fontSize="sm" color="gray.500">
                    {route.name}
                  </Text>
                  <Code colorScheme="blue" fontSize="md">
                    {route.path}
                  </Code>
                </VStack>
              </Link>
            </Box>
          ))}
        </Stack>
        </VStack>
      </Box>
    </AuthGuard>
  );
}
