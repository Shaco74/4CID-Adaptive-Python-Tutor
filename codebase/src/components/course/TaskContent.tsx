"use client";

import { Box, Heading, Text, Flex } from '@chakra-ui/react';
import { ContentBlock } from './ContentBlock';
import type { CourseTask } from '@/types/courseTypes';
import type React from 'react';
import { BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TaskContentProps {
  task: CourseTask;
  currentStep?: number;
  totalSteps?: number;
}

export const TaskContent: React.FC<TaskContentProps> = ({ task, currentStep, totalSteps }) => {
  const t = useTranslations('course');
  // Separate task blocks from other content
  const regularBlocks = task.blocks.filter(block => block.type !== 'task');
  const taskBlocks = task.blocks.filter(block => block.type === 'task');

  return (
    <Flex direction="column" flex="1" minH="0">
      {/* Top section: Header + regular content */}
      <Box>
        {/* Icon Header mit Lernziel (V2 Design) */}
        <Flex
          align="flex-start"
          gap={4}
          mb={5}
          pb={4}
          borderBottomWidth="1px"
          borderColor="gray.700"
        >
          <Flex
            align="center"
            justify="center"
            w={12}
            h={12}
            borderRadius="xl"
            bg="cyan.900"
            borderWidth="2px"
            borderColor="cyan.600"
            flexShrink={0}
          >
            <BookOpen size={24} color="#22d3ee" />
          </Flex>
          <Box flex={1}>
            {currentStep && totalSteps && (
              <Text fontSize="xs" color="gray.400" textTransform="uppercase" letterSpacing="wider">
                {t('stepOf', { current: currentStep, total: totalSteps })}
              </Text>
            )}
            <Heading as="h2" size="md" mb={1}>
              {task.title}
            </Heading>
            <Text fontSize="sm" color="cyan.400">
              📚 {task.description}
            </Text>
          </Box>
        </Flex>

        {/* Regular content blocks */}
        <Flex direction="column" gap={4} alignItems="stretch">
          {regularBlocks.map((block, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <ContentBlock key={index} block={block} />
          ))}
        </Flex>
      </Box>

      {/* Bottom section: Task blocks - pushed to bottom with mt-auto */}
      {taskBlocks.length > 0 && (
        <Box mt="auto" pt={4}>
          <Flex direction="column" gap={4} alignItems="stretch">
            {taskBlocks.map((block, index) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <ContentBlock key={`task-${index}`} block={block} />
            ))}
          </Flex>
        </Box>
      )}
    </Flex>
  );
};