"use client";

import React from "react";
import { IconButton } from "@chakra-ui/react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { useTranslations } from "next-intl";

interface ChatIconProps {
  onClick: () => void;
  isOpen?: boolean;
}

export default function ChatIcon({ onClick, isOpen = false }: ChatIconProps) {
  const t = useTranslations('course');
  // Hide icon when chat is open
  if (isOpen) return null;

  return (
    <IconButton
      aria-label={t('openChat')}
      onClick={onClick}
      position="fixed"
      top={"90px"}
      right={6}
      colorScheme="blue"
      bg="blue.500"
      borderRadius="full"
      boxShadow="lg"
      zIndex={1000}
      scale={1.3}
      _hover={{
        transform: "scale(1.4)",
        transition: "transform 0.2s",
        bg: "blue.600"
      }}
    >
      <IoChatbubbleEllipsesOutline color="white" />
    </IconButton>
  );
}