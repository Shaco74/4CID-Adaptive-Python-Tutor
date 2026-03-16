"use client";

import React, { useMemo } from 'react';
import { Box, Text, Code } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';

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

interface StructuredContentRendererProps {
  structured: StructuredResponse;
}

const AdmonitionComponent: React.FC<{ item: StructuredContentItem }> = ({ item }) => {
  const getBorderColor = () => {
    switch (item.admonition_type) {
      case 'warning': return 'orange.400';
      case 'error': return 'red.400';
      case 'success': return 'green.400';
      case 'note': return 'purple.400';
      default: return 'blue.400';
    }
  };

  const getBgColor = () => {
    switch (item.admonition_type) {
      case 'warning': return { base: 'orange.900', _light: 'orange.50' };
      case 'error': return { base: 'red.900', _light: 'red.50' };
      case 'success': return { base: 'green.900', _light: 'green.50' };
      case 'note': return { base: 'purple.900', _light: 'purple.50' };
      default: return { base: 'blue.900', _light: 'blue.50' };
    }
  };

  return (
    <Box
      mb={3}
      p={3}
      borderRadius="md"
      borderLeftWidth="4px"
      borderLeftColor={getBorderColor()}
      bg={getBgColor()}
      color={{ base: "gray.100", _light: "gray.800" }}
    >
      {item.title && (
        <Text fontWeight="bold" mb={2} color={{ base: "gray.50", _light: "gray.900" }}>
          {item.title}
        </Text>
      )}
      <ReactMarkdown
        components={{
          code({ children, ...props }) {
            return <Code {...props} bg={{ base: "gray.700", _light: "gray.100" }} color={{ base: "gray.100", _light: "gray.800" }}>{children}</Code>;
          }
        }}
      >
        {item.content}
      </ReactMarkdown>
    </Box>
  );
};

const CodeBlockComponent: React.FC<{ item: StructuredContentItem }> = ({ item }) => {
  // Calculate height based on number of lines
  const editorHeight = useMemo(() => {
    const lineCount = (item.content.match(/\n/g) || []).length + 1;
    const lineHeight = 19; // Monaco default line height
    const padding = 24; // top + bottom padding
    return Math.min(lineCount * lineHeight + padding, 300); // Max 300px
  }, [item.content]);

  return (
    <Box mb={3} borderRadius="md" overflow="hidden" width="100%" minWidth="400px">
      <Editor
        height={`${editorHeight}px`}
        language={item.language || "python"}
        value={item.content}
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
          automaticLayout: true, // Auto-resize to container
        }}
      />
    </Box>
  );
};

const TextComponent: React.FC<{ item: StructuredContentItem }> = ({ item }) => {
  return (
    <Box mb={2}>
      <ReactMarkdown
        components={{
          code({ children, ...props }) {
            return <Code {...props} bg={{ base: "gray.700", _light: "gray.200" }} color={{ base: "gray.100", _light: "gray.800" }}>{children}</Code>;
          }
        }}
      >
        {item.content}
      </ReactMarkdown>
    </Box>
  );
};

export const StructuredContentRenderer: React.FC<StructuredContentRendererProps> = ({ structured }) => {
  if (!structured?.content || !Array.isArray(structured.content)) {
    return null;
  }

  return (
    <Box>
      {structured.content.map((item, index) => {
        switch (item.type) {
          case 'admonition':
            return <AdmonitionComponent key={index} item={item} />;
          case 'codeblock':
            return <CodeBlockComponent key={index} item={item} />;
          case 'text':
          default:
            return <TextComponent key={index} item={item} />;
        }
      })}
    </Box>
  );
};

export default StructuredContentRenderer;