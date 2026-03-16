"use client";

import React from 'react';
import { Box, Text, Heading, Code, Flex, HStack } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import { ContentBlock as ContentBlockType } from '@/types/courseTypes';
import { Code2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

// Monaco Editor dynamisch laden (nur client-side)
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface ContentBlockProps {
  block: ContentBlockType;
}

export const TextBlock: React.FC<ContentBlockProps> = ({ block }) => {
  return (
    <Box mb={4}>
      {block.title && <Heading size="sm" mb={2}>{block.title}</Heading>}
      <ReactMarkdown
        components={{
          h1({ children }) {
            return (
              <Text as="h2" fontSize="2xl" fontWeight="bold" mb={3} mt={4}>
                {children}
              </Text>
            );
          },
          h2({ children }) {
            return (
              <Text style={{marginBottom:10, marginBlockStart: 0}} as="h3" fontSize="xl" fontWeight="semibold" mb={2} mt={4}>
                {children}
              </Text>
            );
          },
          h3({ children }) {
            return (
              <Text  as="h4" fontSize="lg" fontWeight="semibold" mb={2} mt={3}>
                {children}
              </Text>
            );
          },
          p({ children }) {
            return <Text style={{marginBottom:10}}>{children}</Text>;
          },
          ul({ children }) {
            return (
              <Box as="ul" pl={5} mb={2} listStyleType="disc" css={{ '& > li': { display: 'list-item' } }}>
                {children}
              </Box>
            );
          },
          li({ children }) {
            return (
              <Box as="li" mb={1} display="list-item" color="white">
                <Text as="span">{children}</Text>
              </Box>
            );
          },
          strong({ children }) {
            return <Text as="span" fontWeight="bold">{children}</Text>;
          },
          code({ children, ...props }) {
            return (
              <Code {...props} bg="gray.700" px={1} borderRadius="sm">{children}</Code>
            );
          }
        }}
      >
        {block.content}
      </ReactMarkdown>
    </Box>
  );
};

export const CodeBlock: React.FC<ContentBlockProps> = ({ block }) => {
  // Berechne die Höhe basierend auf Anzahl der Zeilen - ohne Maximum, damit kein Code abgeschnitten wird
  const lineCount = block.content.split('\n').length;
  const lineHeight = 20; // Monaco default line height
  const paddingVertical = 24; // 12px top + 12px bottom padding
  const editorHeight = Math.max(80, lineCount * lineHeight + paddingVertical);

  return (
    <Box mb={4}>
      <Box borderRadius="lg" overflow="hidden" bg="gray.950" borderWidth="1px" borderColor="gray.700">
        {/* Window Header mit Dots + Icon */}
        <Flex
          align="center"
          justify="space-between"
          px={4}
          py={2}
          bg="gray.800"
          borderBottomWidth="1px"
          borderColor="gray.700"
        >
          <HStack gap={2}>
            <Box w={3} h={3} borderRadius="full" bg="red.500" />
            <Box w={3} h={3} borderRadius="full" bg="yellow.500" />
            <Box w={3} h={3} borderRadius="full" bg="green.500" />
          </HStack>
          {block.title && (
            <HStack gap={2}>
              <Code2 size={14} color="#a0aec0" />
              <Text fontSize="xs" color="gray.400">{block.title}</Text>
            </HStack>
          )}
        </Flex>
        <Editor
          height={`${editorHeight}px`}
          language="python"
          value={block.content}
          theme="vs-dark"
          options={{
            readOnly: true,
            domReadOnly: true, // Prevents scroll capture
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'off',
            folding: false,
            fontSize: 13,
            padding: { top: 12, bottom: 12 },
            scrollbar: { vertical: 'hidden', horizontal: 'hidden', handleMouseWheel: false },
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            renderLineHighlight: 'none',
            contextmenu: false,
            cursorStyle: 'line-thin',
          }}
          onMount={(editor) => {
            // Disable scroll wheel capture completely
            editor.onDidScrollChange(() => { });
            // Let scroll events pass through to parent
            const domNode = editor.getDomNode();
            if (domNode) {
              domNode.style.pointerEvents = 'none';
            }
          }}
        />
      </Box>
    </Box>
  );
};

export const HintBlock: React.FC<ContentBlockProps> = ({ block }) => {
  const getBorderColor = () => {
    switch (block.severity) {
      case 'warning': return 'orange.800';
      case 'error': return 'red.800';
      case 'success': return 'green.800';
      default: return 'blue.800';
    }
  };

  const getBgColor = () => {
    switch (block.severity) {
      case 'warning': return 'orange.700'; // Dunkler als die anderen
      case 'error': return 'red.600';
      case 'success': return 'green.600';
      default: return 'blue.600';
    }
  };

  return (
    <Box
      mb={4}
      p={4}
      borderRadius="md"
      borderLeftWidth="6px"
      borderLeftColor={getBorderColor()}
      bg={getBgColor()}
    >
      {block.title && (
        <Text fontWeight="bold" mb={1}>
          {block.title}
        </Text>
      )}
      <ReactMarkdown
        components={{
          code({ children, ...props }) {
            return (
              <Code
                {...props}
                bg="blackAlpha.300"
                fontWeight={"bold"}
                px={1}
                borderRadius="sm"
              >
                {children}
              </Code>
            );
          },
          p({ children }) {
            return <Text>{children}</Text>;
          }
        }}
      >
        {block.content}
      </ReactMarkdown>
    </Box>
  );
};

export const TaskBlock: React.FC<ContentBlockProps> = ({ block }) => {
  const t = useTranslations('course');
  return (
    <Box>
      <Box borderTopWidth="2px" borderColor="cyan.500" pt={4} mt={2}>
        <Text fontSize="xl" fontWeight="bold" mb={2} color="cyan.400">
          {t('yourTask')}
        </Text>
        <ReactMarkdown
          components={{
            code({ children, ...props }) {
              return (
                <Code
                  {...props}
                  bg="gray.900"
                  color="teal.300"
                  px={2}
                  py={1}
                  mx={1}
                  fontSize="md"
                  fontWeight="semibold"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="teal.700"
                >
                  {children}
                </Code>
              );
            },
            p({ children }) {
              return <Text fontSize="md">{children}</Text>;
            },
            strong({ children }) {
              return <Text as="span" fontWeight="bold">{children}</Text>;
            }
          }}
        >
          {block.content}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

export const ContentBlock: React.FC<ContentBlockProps> = ({ block }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'code':
      return <CodeBlock block={block} />;
    case 'hint':
      return <HintBlock block={block} />;
    case 'task':
      return <TaskBlock block={block} />;
    default:
      return <TextBlock block={block} />;
  }
};
