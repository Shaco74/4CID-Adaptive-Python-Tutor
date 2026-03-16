"use client";

import React, { useState } from "react";
import { Box, VStack, HStack, Text, Code, Heading, Separator, Badge } from "@chakra-ui/react";
import StructuredContentRenderer from "@/components/chat/StructuredContentRenderer";
import AuthGuard from "@/components/AuthGuard";

interface StructuredContentItem {
  type: "text" | "admonition" | "codeblock";
  content: string;
  title?: string | null;
  admonition_type?: "info" | "warning" | "error" | "success" | "note" | null;
  language?: "python" | null;
}

interface StructuredResponse {
  content: StructuredContentItem[];
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  structured?: StructuredResponse;
}

// Mock-Daten für verschiedene Chat-Szenarien
const mockMessages: Message[] = [
  {
    id: "1",
    text: "Hallo! Ich bin dein AI-Assistent für das Python-Bootcamp. Wie kann ich dir beim Lernen helfen?",
    isUser: false,
    timestamp: new Date("2024-01-15T10:00:00"),
    structured: {
      content: [
        {
          type: "text",
          content: "Hallo! Ich bin dein AI-Assistent für das Python-Bootcamp. Wie kann ich dir beim Lernen helfen?",
        },
      ],
    },
  },
  {
    id: "2",
    text: "Wie erstelle ich eine Liste in Python?",
    isUser: true,
    timestamp: new Date("2024-01-15T10:01:00"),
  },
  {
    id: "3",
    text: "",
    isUser: false,
    timestamp: new Date("2024-01-15T10:01:30"),
    structured: {
      content: [
        {
          type: "text",
          content: "Listen sind eine der wichtigsten Datenstrukturen in Python. Es gibt mehrere Möglichkeiten, eine Liste zu erstellen:",
        },
        {
          type: "admonition",
          admonition_type: "info",
          title: "Leere Liste erstellen",
          content: "Du kannst eine leere Liste mit `[]` oder `list()` erstellen.",
        },
        {
          type: "codeblock",
          language: "python",
          content: "# Leere Liste\nmeine_liste = []\n\n# Oder mit list()\nmeine_liste = list()\n\n# Liste mit Werten\nzahlen = [1, 2, 3, 4, 5]\nnamen = [\"Anna\", \"Bob\", \"Clara\"]",
        },
        {
          type: "text",
          content: "Probier es gleich mal aus! Erstelle eine Liste mit deinen Lieblingsfarben.",
        },
      ],
    },
  },
  {
    id: "4",
    text: "Wie füge ich Elemente zu einer Liste hinzu?",
    isUser: true,
    timestamp: new Date("2024-01-15T10:02:00"),
  },
  {
    id: "5",
    text: "",
    isUser: false,
    timestamp: new Date("2024-01-15T10:02:30"),
    structured: {
      content: [
        {
          type: "text",
          content: "Es gibt verschiedene Methoden, um Elemente zu einer Liste hinzuzufügen:",
        },
        {
          type: "admonition",
          admonition_type: "success",
          title: "append() - Ein Element am Ende hinzufügen",
          content: "Die häufigste Methode. Fügt ein Element am **Ende** der Liste hinzu.",
        },
        {
          type: "codeblock",
          language: "python",
          content: "farben = [\"rot\", \"blau\"]\nfarben.append(\"grün\")\nprint(farben)  # ['rot', 'blau', 'grün']",
        },
        {
          type: "admonition",
          admonition_type: "note",
          title: "insert() - An bestimmter Position einfügen",
          content: "Mit `insert(index, element)` kannst du an einer bestimmten Position einfügen.",
        },
        {
          type: "codeblock",
          language: "python",
          content: "farben = [\"rot\", \"blau\"]\nfarben.insert(1, \"gelb\")  # An Index 1 einfügen\nprint(farben)  # ['rot', 'gelb', 'blau']",
        },
        {
          type: "admonition",
          admonition_type: "warning",
          title: "Vorsicht bei extend()",
          content: "`extend()` fügt **mehrere** Elemente hinzu, nicht die Liste als Ganzes!",
        },
        {
          type: "codeblock",
          language: "python",
          content: "liste1 = [1, 2]\nliste2 = [3, 4]\n\n# extend() fügt einzelne Elemente hinzu\nliste1.extend(liste2)\nprint(liste1)  # [1, 2, 3, 4]\n\n# append() würde die ganze Liste als EIN Element hinzufügen\nliste1 = [1, 2]\nliste1.append(liste2)\nprint(liste1)  # [1, 2, [3, 4]]",
        },
      ],
    },
  },
  {
    id: "6",
    text: "Mein Code funktioniert nicht: liste.add(5)",
    isUser: true,
    timestamp: new Date("2024-01-15T10:03:00"),
  },
  {
    id: "7",
    text: "",
    isUser: false,
    timestamp: new Date("2024-01-15T10:03:30"),
    structured: {
      content: [
        {
          type: "admonition",
          admonition_type: "error",
          title: "Häufiger Fehler!",
          content: "Listen haben **keine** `add()` Methode! Das ist ein häufiger Fehler, besonders wenn du von anderen Programmiersprachen kommst.",
        },
        {
          type: "text",
          content: "Der korrekte Methodenname ist `append()` für Listen:",
        },
        {
          type: "codeblock",
          language: "python",
          content: "# FALSCH - gibt einen Fehler\nliste.add(5)  # AttributeError: 'list' object has no attribute 'add'\n\n# RICHTIG\nliste.append(5)",
        },
        {
          type: "admonition",
          admonition_type: "info",
          title: "Merkhilfe",
          content: "`add()` wird bei **Sets** verwendet, nicht bei Listen. Listen verwenden `append()`.",
        },
      ],
    },
  },
  {
    id: "8",
    text: "Danke! Kannst du mir noch for-Schleifen erklären?",
    isUser: true,
    timestamp: new Date("2024-01-15T10:04:00"),
  },
  {
    id: "9",
    text: "",
    isUser: false,
    timestamp: new Date("2024-01-15T10:04:30"),
    structured: {
      content: [
        {
          type: "text",
          content: "For-Schleifen sind perfekt, um über Listen zu iterieren! Hier ein einfaches Beispiel:",
        },
        {
          type: "codeblock",
          language: "python",
          content: "farben = [\"rot\", \"blau\", \"grün\"]\n\nfor farbe in farben:\n    print(f\"Ich mag {farbe}\")",
        },
        {
          type: "text",
          content: "Das Ergebnis wäre:",
        },
        {
          type: "codeblock",
          language: "python",
          content: "Ich mag rot\nIch mag blau\nIch mag grün",
        },
        {
          type: "admonition",
          admonition_type: "success",
          title: "Mit Index iterieren",
          content: "Wenn du auch den Index brauchst, verwende `enumerate()`:",
        },
        {
          type: "codeblock",
          language: "python",
          content: "for i, farbe in enumerate(farben):\n    print(f\"{i}: {farbe}\")\n\n# Ausgabe:\n# 0: rot\n# 1: blau\n# 2: grün",
        },
      ],
    },
  },
];

// Metadaten für die Demo
interface MessageMetadata {
  id: string;
  structuredItems: number;
  hasAdmonition: boolean;
  admonitionTypes: string[];
  hasCodeblock: boolean;
  responseTime?: string;
}

function getMessageMetadata(message: Message): MessageMetadata {
  const items = message.structured?.content || [];
  const admonitions = items.filter(i => i.type === "admonition");

  return {
    id: message.id,
    structuredItems: items.length,
    hasAdmonition: admonitions.length > 0,
    admonitionTypes: admonitions.map(a => a.admonition_type || "info"),
    hasCodeblock: items.some(i => i.type === "codeblock"),
    responseTime: message.isUser ? undefined : "~1.2s",
  };
}

export default function ChatDemoPage() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const chatWidth = 600; // Gleiche Breite wie ChatDrawer

  return (
    <AuthGuard requireAdmin={true}>
    <Box minH="100vh" bg="gray.900" p={6}>
      <Heading color="white" mb={6}>Chat UI Demo</Heading>

      <HStack align="start" gap={6}>
        {/* Chat-Bereich - gleiche Breite wie echtes Chat-Fenster */}
        <Box
          width={`${chatWidth}px`}
          bg="gray.800"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.600"
          overflow="hidden"
        >
          {/* Header */}
          <HStack
            p={4}
            borderBottom="1px solid"
            borderColor="gray.600"
            justify="space-between"
          >
            <Text fontSize="lg" fontWeight="semibold" color="white">
              AI Chat Assistant (Demo)
            </Text>
            <Badge colorPalette="blue">Mock Data</Badge>
          </HStack>

          {/* Messages Area */}
          <Box
            p={4}
            maxH="70vh"
            overflowY="auto"
            css={{
              '&::-webkit-scrollbar': { width: '6px' },
              '&::-webkit-scrollbar-track': { background: '#2D3748' },
              '&::-webkit-scrollbar-thumb': { background: '#4A5568', borderRadius: '3px' },
            }}
          >
            <VStack gap={4} align="stretch">
              {mockMessages.map((message) => (
                <Box
                  key={message.id}
                  alignSelf={message.isUser ? "flex-end" : "flex-start"}
                  maxW="90%"
                  onClick={() => setSelectedMessage(message.id)}
                  cursor="pointer"
                  opacity={selectedMessage && selectedMessage !== message.id ? 0.6 : 1}
                  transition="opacity 0.2s"
                  _hover={{ opacity: 1 }}
                >
                  <Box
                    bg={message.isUser ? "blue.500" : "gray.100"}
                    color={message.isUser ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    borderBottomRightRadius={message.isUser ? "sm" : "lg"}
                    borderBottomLeftRadius={message.isUser ? "lg" : "sm"}
                    border={selectedMessage === message.id ? "2px solid" : "none"}
                    borderColor="blue.400"
                  >
                    {!message.isUser && message.structured ? (
                      <StructuredContentRenderer structured={message.structured} />
                    ) : (
                      <Text fontSize="sm" lineHeight="1.4">
                        {message.text}
                      </Text>
                    )}
                  </Box>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mt={1}
                    textAlign={message.isUser ? "right" : "left"}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Box>
              ))}
            </VStack>
          </Box>

          {/* Input Area (disabled for demo) */}
          <Box
            p={4}
            bg="gray.700"
            borderTop="1px solid"
            borderColor="gray.600"
          >
            <Text fontSize="sm" color="gray.400" textAlign="center">
              Demo-Modus - Eingabe deaktiviert
            </Text>
          </Box>
        </Box>

        {/* Metadata Sidebar */}
        <Box
          flex="1"
          minW="300px"
          maxW="400px"
          bg="gray.800"
          borderRadius="lg"
          border="1px solid"
          borderColor="gray.600"
          p={4}
        >
          <Heading size="md" color="white" mb={4}>Metadaten</Heading>

          {selectedMessage ? (
            <>
              {(() => {
                const msg = mockMessages.find(m => m.id === selectedMessage);
                if (!msg) return null;
                const meta = getMessageMetadata(msg);

                return (
                  <VStack align="stretch" gap={3}>
                    <Box>
                      <Text fontSize="xs" color="gray.400">Message ID</Text>
                      <Code>{meta.id}</Code>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.400">Typ</Text>
                      <Badge colorPalette={msg.isUser ? "blue" : "green"}>
                        {msg.isUser ? "User" : "AI Assistant"}
                      </Badge>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.400">Timestamp</Text>
                      <Text fontSize="sm" color="white">
                        {msg.timestamp.toLocaleString()}
                      </Text>
                    </Box>

                    {!msg.isUser && (
                      <>
                        <Separator />

                        <Box>
                          <Text fontSize="xs" color="gray.400">Structured Content Items</Text>
                          <Text fontSize="sm" color="white">{meta.structuredItems}</Text>
                        </Box>

                        <Box>
                          <Text fontSize="xs" color="gray.400">Enthält Admonitions</Text>
                          <Badge colorPalette={meta.hasAdmonition ? "green" : "gray"}>
                            {meta.hasAdmonition ? "Ja" : "Nein"}
                          </Badge>
                        </Box>

                        {meta.hasAdmonition && (
                          <Box>
                            <Text fontSize="xs" color="gray.400">Admonition Types</Text>
                            <HStack gap={1} flexWrap="wrap">
                              {meta.admonitionTypes.map((type, i) => (
                                <Badge
                                  key={i}
                                  colorPalette={
                                    type === "error" ? "red" :
                                    type === "warning" ? "orange" :
                                    type === "success" ? "green" :
                                    type === "note" ? "purple" : "blue"
                                  }
                                  size="sm"
                                >
                                  {type}
                                </Badge>
                              ))}
                            </HStack>
                          </Box>
                        )}

                        <Box>
                          <Text fontSize="xs" color="gray.400">Enthält Codeblocks</Text>
                          <Badge colorPalette={meta.hasCodeblock ? "green" : "gray"}>
                            {meta.hasCodeblock ? "Ja" : "Nein"}
                          </Badge>
                        </Box>

                        {meta.responseTime && (
                          <Box>
                            <Text fontSize="xs" color="gray.400">Response Time (Mock)</Text>
                            <Text fontSize="sm" color="white">{meta.responseTime}</Text>
                          </Box>
                        )}
                      </>
                    )}

                    <Separator />

                    <Box>
                      <Text fontSize="xs" color="gray.400" mb={2}>Raw Text</Text>
                      <Box
                        bg="gray.900"
                        p={2}
                        borderRadius="md"
                        fontSize="xs"
                        color="gray.300"
                        maxH="100px"
                        overflowY="auto"
                      >
                        <pre style={{ whiteSpace: "pre-wrap" }}>
                          {msg.text || "(Structured Response)"}
                        </pre>
                      </Box>
                    </Box>
                  </VStack>
                );
              })()}
            </>
          ) : (
            <Text color="gray.400" fontSize="sm">
              Klicke auf eine Nachricht um Metadaten anzuzeigen
            </Text>
          )}
        </Box>
      </HStack>

      {/* Legende für Admonition Types */}
      <Box mt={8} p={4} bg="gray.800" borderRadius="lg">
        <Heading size="sm" color="white" mb={4}>Admonition Types Legende</Heading>
        <HStack gap={4} flexWrap="wrap">
          <HStack>
            <Box w={4} h={4} bg="blue.400" borderRadius="sm" />
            <Text color="white" fontSize="sm">info</Text>
          </HStack>
          <HStack>
            <Box w={4} h={4} bg="green.400" borderRadius="sm" />
            <Text color="white" fontSize="sm">success</Text>
          </HStack>
          <HStack>
            <Box w={4} h={4} bg="orange.400" borderRadius="sm" />
            <Text color="white" fontSize="sm">warning</Text>
          </HStack>
          <HStack>
            <Box w={4} h={4} bg="red.400" borderRadius="sm" />
            <Text color="white" fontSize="sm">error</Text>
          </HStack>
          <HStack>
            <Box w={4} h={4} bg="purple.400" borderRadius="sm" />
            <Text color="white" fontSize="sm">note</Text>
          </HStack>
        </HStack>
      </Box>
    </Box>
    </AuthGuard>
  );
}
