'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Code
} from '@chakra-ui/react';
import { MdMessage, MdDescription, MdTerminal } from 'react-icons/md';
import Editor from '@monaco-editor/react';
import { useColorMode } from '@/components/ui/color-mode';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

export function OnboardingStep2() {
  const { colorMode } = useColorMode();
  const t = useTranslations('onboarding.step2');
  const locale = useLocale();

  // Code examples based on locale
  const commentExample = locale === 'en'
    ? `# This is a comment - not executed
print("Hello World")  # Only the print() command is executed`
    : `# Das hier ist ein Kommentar - wird nicht ausgeführt
print("Hallo Welt")  # Nur der print()-Befehl wird ausgeführt`;

  const whitespaceWrong = locale === 'en'
    ? `name = "Anna"
print("Hello" + name)
# Output: HelloAnna (No space!)`
    : `name = "Anna"
print("Hallo" + name)
# Ausgabe: HalloAnna (Kein Leerzeichen!)`;

  const whitespaceCorrect = locale === 'en'
    ? `name = "Anna"
print("Hello " + name)
# Output: Hello Anna (With space!)`
    : `name = "Anna"
print("Hallo " + name)
# Ausgabe: Hallo Anna (Mit Leerzeichen!)`;

  const whitespaceNumbers = locale === 'en'
    ? `age = 25
print("Age:" + str(age))      # ❌ Output: Age:25
print("Age: " + str(age))     # ✅ Output: Age: 25`
    : `alter = 25
print("Alter:" + str(alter))      # ❌ Ausgabe: Alter:25
print("Alter: " + str(alter))     # ✅ Ausgabe: Alter: 25`;

  const fullExample = locale === 'en'
    ? `# Welcome to Python! (This text is ignored)
name = "Learner"
print("Hello " + name + "!")
print("You have successfully run your first code!")

# Calculate something simple (This text is also ignored)
age = 25
next_year = age + 1
print("Next year you will be " + str(next_year) + " years old.")`
    : `# Willkommen bei Python! (Dieser Text wird ignoriert)
name = "Lernender"
print("Hallo " + name + "!")
print("Du hast erfolgreich deinen ersten Code ausgeführt!")

# Berechne etwas Einfaches (Auch dieser Text wird ignoriert)
alter = 25
naechstes_jahr = alter + 1
print("Nächstes Jahr wirst du " + str(naechstes_jahr) + " Jahre alt sein.")`;

  const exampleOutput = locale === 'en'
    ? <>Hello Learner!<br />You have successfully run your first code!<br />Next year you will be 26 years old.</>
    : <>Hallo Lernender!<br />Du hast erfolgreich deinen ersten Code ausgeführt!<br />Nächstes Jahr wirst du 26 Jahre alt sein.</>;

  return (
    <Box>
      <VStack gap={8} align="stretch">
        {/* Introduction */}
        <Box textAlign="center" py={6}>
          <Heading size="2xl" mb={4} bgImage="linear-gradient(to right, #63B3ED, #9F7AEA)"
            bgClip="text"
            color="transparent">
            {t('title')}
          </Heading>
          <Text fontSize="lg" color={{ base: "gray.300", _light: "gray.600" }} maxW="2xl" mx="auto" mb={6}>
            {t('intro')}
          </Text>

          {/* Full Overview Image */}
          <Box
            borderRadius="lg"
            overflow="hidden"
            border="2px solid"
            borderColor={{ base: "gray.600", _light: "gray.300" }}
            boxShadow="xl"
            mx="auto"
            maxW="100%"
          >
            <Image
              src="/onboarding/kursansicht-full.png"
              alt={t('layoutAlt')}
              width={1200}
              height={675}
              style={{ width: '100%', height: 'auto' }}
              priority
            />
          </Box>
          <Text fontSize="sm" color={{ base: "gray.500", _light: "gray.500" }} mt={2}>
            {t('layoutCaption')}
          </Text>
        </Box>

        {/* Editor Components */}
        <VStack gap={6}>
          <Heading size="lg" mb={4}>
            {t('mainAreas')}
          </Heading>

          {/* Code Editor Area */}
          <Box bg={{ base: "gray.800", _light: "purple.50" }} border="1px solid" borderColor={{ base: "purple.500", _light: "purple.300" }} w="full" p={6} borderRadius="lg">
            <HStack gap={4} align="start">
              <Box bg="purple.500" p={2} borderRadius="md" mb={2}>
                <MdDescription size={24} color="white" />
              </Box>
              <Box flex={1}>
                <HStack mb={2} gap={3} align="center">
                  <Heading size="md" color={{ base: "purple.400", _light: "purple.600" }}>
                    {t('codeEditor.title')}
                  </Heading>
                  <Text fontSize="xs" bg={{ base: "purple.900", _light: "purple.100" }} color={{ base: "purple.200", _light: "purple.800" }} px={2} py={1} borderRadius="md">
                    {t('codeEditor.badge')}
                  </Text>
                </HStack>
                <Text color={{ base: "gray.300", _light: "gray.700" }} mb={3}>
                  {t('codeEditor.description')}
                </Text>
                <VStack align="start" gap={1} ml={4}>
                  <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• {t('codeEditor.feature1')}</Text>
                  <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• {t('codeEditor.feature2')}</Text>
                  <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• {t('codeEditor.feature3')}</Text>
                </VStack>
                {/* Code Editor Image */}
                <Box mt={4} borderRadius="md" overflow="hidden" border="1px solid" borderColor={{ base: "gray.600", _light: "gray.300" }}>
                  <Image
                    src="/onboarding/kursansicht-code-editor.png"
                    alt={t('codeEditor.imageAlt')}
                    width={800}
                    height={450}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>

          {/* Console Area */}
          <Box bg={{ base: "gray.800", _light: "green.50" }} border="1px solid" borderColor={{ base: "green.500", _light: "green.300" }} w="full" p={6} borderRadius="lg">
            <HStack gap={4} align="start">
              <Box bg="green.500" p={2} borderRadius="md" mb={2}>
                <MdTerminal size={24} color="white" />
              </Box>
              <Box flex={1}>
                <HStack mb={2} gap={3} align="center">
                  <Heading size="md" color={{ base: "green.400", _light: "green.600" }}>
                    {t('console.title')}
                  </Heading>
                  <Text fontSize="xs" bg={{ base: "green.900", _light: "green.100" }} color={{ base: "green.200", _light: "green.800" }} px={2} py={1} borderRadius="md">
                    {t('console.badge')}
                  </Text>
                </HStack>
                <Text color={{ base: "gray.300", _light: "gray.700" }} mb={3}>
                  {t('console.description')}
                </Text>
                <VStack align="start" gap={1} ml={4}>
                  <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• {t('console.feature1')}</Text>
                  <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• {t('console.feature2')}</Text>
                </VStack>
                {/* Console Image */}
                <Box mt={4} borderRadius="md" overflow="hidden" border="1px solid" borderColor={{ base: "gray.600", _light: "gray.300" }}>
                  <Image
                    src="/onboarding/kursansicht-output-konsole.png"
                    alt={t('console.imageAlt')}
                    width={800}
                    height={100}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>

          {/* Task Drawer */}
          <Box bg={{ base: "gray.800", _light: "blue.50" }} border="1px solid" borderColor={{ base: "blue.500", _light: "blue.300" }} w="full" p={6} borderRadius="lg">
            <HStack gap={4} align="start">
              <Box bg="blue.500" p={2} borderRadius="md" mb={2}>
                <MdMessage size={24} color="white" />
              </Box>
              <Box flex={1}>
                <HStack mb={2} gap={3} align="center">
                  <Heading size="md" color={{ base: "blue.400", _light: "blue.600" }}>
                    {t('taskPanel.title')}
                  </Heading>
                  <Text fontSize="xs" bg={{ base: "blue.900", _light: "blue.100" }} color={{ base: "blue.200", _light: "blue.800" }} px={2} py={1} borderRadius="md">
                    {t('taskPanel.badge')}
                  </Text>
                </HStack>
                <Text color={{ base: "gray.300", _light: "gray.700" }} mb={3}>
                  {t('taskPanel.description')}
                </Text>
                <VStack align="start" gap={1} ml={4}>
                  <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• {t('taskPanel.feature1')}</Text>
                  <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>• {t('taskPanel.feature2')}</Text>
                </VStack>
                {/* Task Drawer Image */}
                <Box mt={4} borderRadius="md" overflow="hidden" border="1px solid" borderColor={{ base: "gray.600", _light: "gray.300" }}>
                  <Image
                    src="/onboarding/kursansicht-tutorial-drawer.png"
                    alt={t('taskPanel.imageAlt')}
                    width={800}
                    height={600}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              </Box>
            </HStack>
          </Box>
        </VStack>

        {/* Python Basics: Comments */}
        <Box bg={{ base: "gray.800", _light: "yellow.50" }} border="1px solid" borderColor={{ base: "yellow.500", _light: "yellow.300" }} p={6} borderRadius="lg">
          <Heading size="md" mb={3} color={{ base: "yellow.400", _light: "yellow.700" }}>
            {t('comments.title')}
          </Heading>
          <Text color={{ base: "gray.300", _light: "gray.700" }} mb={3}>
            {t('comments.description')}
          </Text>
          <Box
            borderRadius="md"
            overflow="hidden"
            border="1px"
            borderColor={{ base: "gray.600", _light: "gray.300" }}
            bg={{ base: "black", _light: "white" }}
          >
            <Editor
              defaultLanguage="python"
              height="80px"
              width="800px"
              value={commentExample}
              options={{
                readOnly: true,
                domReadOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                folding: false,
                fontSize: 14,
                fontFamily: 'JetBrains Mono, SF Mono, Monaco, Inconsolata, "Roboto Mono", source-code-pro, Menlo, "Courier New", monospace',
                padding: { top: 8, bottom: 8 },
                scrollbar: { vertical: 'hidden', horizontal: 'hidden', handleMouseWheel: false },
                overviewRulerLanes: 0,
                hideCursorInOverviewRuler: true,
                overviewRulerBorder: false,
                automaticLayout: true,
              }}
              theme={colorMode === 'light' ? 'vs' : 'vs-dark'}
            />
          </Box>
          <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} mt={2}>
            {t('comments.tip')}
          </Text>
        </Box>

        {/* Python Basics: Whitespace */}
        <Box bg={{ base: "gray.800", _light: "red.50" }} border="1px solid" borderColor={{ base: "red.500", _light: "red.300" }} p={6} borderRadius="lg">
          <Heading size="md" mb={3} color={{ base: "red.400", _light: "red.700" }}>
            {t('whitespace.title')}
          </Heading>
          <Text color={{ base: "gray.300", _light: "gray.700" }} mb={3}>
            {t('whitespace.description')}
          </Text>

          <VStack gap={3} align="stretch">
            <Box>
              <Text fontSize="sm" fontWeight="bold" color={{ base: "red.300", _light: "red.700" }} mb={2}>
                {t('whitespace.wrongLabel')}
              </Text>
              <Box
                borderRadius="md"
                overflow="hidden"
                border="1px"
                borderColor={{ base: "gray.600", _light: "gray.300" }}
                bg={{ base: "black", _light: "white" }}
              >
                <Editor
                  defaultLanguage="python"
                  height="100px"
                  width="800px"
                  value={whitespaceWrong}
                  options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    folding: false,
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, SF Mono, Monaco, Inconsolata, "Roboto Mono", source-code-pro, Menlo, "Courier New", monospace',
                    padding: { top: 8, bottom: 8 },
                    scrollbar: { vertical: 'hidden', horizontal: 'hidden', handleMouseWheel: false },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    automaticLayout: true,
                  }}
                  theme={colorMode === 'light' ? 'vs' : 'vs-dark'}
                />
              </Box>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" color={{ base: "green.300", _light: "green.700" }} mb={2}>
                {t('whitespace.correctLabel')}
              </Text>
              <Box
                borderRadius="md"
                overflow="hidden"
                border="1px"
                borderColor={{ base: "gray.600", _light: "gray.300" }}
                bg={{ base: "black", _light: "white" }}
              >
                <Editor
                  defaultLanguage="python"
                  height="100px"
                  width="800px"
                  value={whitespaceCorrect}
                  options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    folding: false,
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, SF Mono, Monaco, Inconsolata, "Roboto Mono", source-code-pro, Menlo, "Courier New", monospace',
                    padding: { top: 8, bottom: 8 },
                    scrollbar: { vertical: 'hidden', horizontal: 'hidden', handleMouseWheel: false },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    automaticLayout: true,
                  }}
                  theme={colorMode === 'light' ? 'vs' : 'vs-dark'}
                />
              </Box>
            </Box>

            <Box>
              <Text fontSize="sm" fontWeight="bold" color={{ base: "orange.300", _light: "orange.700" }} mb={2}>
                {t('whitespace.exampleLabel')}
              </Text>
              <Box
                borderRadius="md"
                overflow="hidden"
                border="1px"
                borderColor={{ base: "gray.600", _light: "gray.300" }}
                bg={{ base: "black", _light: "white" }}
              >
                <Editor
                  defaultLanguage="python"
                  height="100px"
                  width="800px"
                  value={whitespaceNumbers}
                  options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    folding: false,
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, SF Mono, Monaco, Inconsolata, "Roboto Mono", source-code-pro, Menlo, "Courier New", monospace',
                    padding: { top: 8, bottom: 8 },
                    scrollbar: { vertical: 'hidden', horizontal: 'hidden', handleMouseWheel: false },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    automaticLayout: true,
                  }}
                  theme={colorMode === 'light' ? 'vs' : 'vs-dark'}
                />
              </Box>
            </Box>
          </VStack>

          <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} mt={3}>
            {t('whitespace.tip')}
          </Text>
        </Box>

        {/* Code Example */}
        <Box>
          <Heading size="lg" mb={4} textAlign="center">
            {t('example.title')}
          </Heading>
          <Box bg={{ base: "gray.900", _light: "gray.50" }} border="1px solid" borderColor={{ base: "gray.600", _light: "gray.300" }} p={6} borderRadius="lg">
            <VStack gap={4}>
              <HStack w="full" justify="space-between" align="center">
                <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }}>{t('example.codeLabel')}</Text>
              </HStack>

              <Box
                borderRadius="md"
                overflow="hidden"
                border="1px"
                borderColor={{ base: "gray.600", _light: "gray.300" }}
                bg={{ base: "black", _light: "gray.50" }}
              >
                <Editor
                  defaultLanguage="python"
                  height="220px"
                  width={'800px'}
                  value={fullExample}
                  options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    folding: false,
                    fontSize: 14,
                    fontFamily: 'JetBrains Mono, SF Mono, Monaco, Inconsolata, "Roboto Mono", source-code-pro, Menlo, "Courier New", monospace',
                    padding: { top: 8, bottom: 8 },
                    scrollbar: { vertical: 'hidden', horizontal: 'hidden', handleMouseWheel: false },
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    automaticLayout: true,
                  }}
                  theme={colorMode === 'light' ? 'vs' : 'vs-dark'}
                />
              </Box>

              <Box w="full" bg={{ base: "gray.800", _light: "green.50" }} p={3} borderRadius="md" border="1px solid" borderColor={{ base: "green.600", _light: "green.400" }}>
                <Text fontSize="sm" color={{ base: "gray.400", _light: "gray.600" }} mb={1}>{t('example.outputLabel')}</Text>
                <Text fontSize="sm" color={{ base: "green.300", _light: "green.700" }} fontFamily="mono">
                  {exampleOutput}
                </Text>
              </Box>

              {/* Line-by-Line Explanation */}
              <Box w="full" mt={4}>
                <Text fontSize="md" fontWeight="bold" color={{ base: "white", _light: "gray.800" }} mb={3}>
                  {t('example.whatDoesEachLine')}
                </Text>
                <VStack align="stretch" gap={2}>
                  <Box bg={{ base: "gray.800", _light: "gray.100" }} p={3} borderRadius="md" borderLeft="3px solid" borderLeftColor="gray.500">
                    <Code fontSize="xs" bg="transparent" color={{ base: "gray.400", _light: "gray.500" }}>{locale === 'en' ? 'Line 1:' : 'Zeile 1:'}</Code>
                    <Code fontSize="sm" mx={2} bg={{ base: "gray.700", _light: "gray.200" }}>{locale === 'en' ? '# Welcome to Python!' : '# Willkommen bei Python!'}</Code>
                    <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }} mt={1}>
                      {t('example.line1')}
                    </Text>
                  </Box>

                  <Box bg={{ base: "gray.800", _light: "blue.50" }} p={3} borderRadius="md" borderLeft="3px solid" borderLeftColor="blue.400">
                    <Code fontSize="xs" bg="transparent" color={{ base: "gray.400", _light: "gray.500" }}>{locale === 'en' ? 'Line 2:' : 'Zeile 2:'}</Code>
                    <Code fontSize="sm" mx={2} bg={{ base: "gray.700", _light: "blue.100" }}>name = &quot;{locale === 'en' ? 'Learner' : 'Lernender'}&quot;</Code>
                    <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }} mt={1}>
                      {t('example.line2')}
                    </Text>
                  </Box>

                  <Box bg={{ base: "gray.800", _light: "purple.50" }} p={3} borderRadius="md" borderLeft="3px solid" borderLeftColor="purple.400">
                    <Code fontSize="xs" bg="transparent" color={{ base: "gray.400", _light: "gray.500" }}>{locale === 'en' ? 'Line 3:' : 'Zeile 3:'}</Code>
                    <Code fontSize="sm" mx={2} bg={{ base: "gray.700", _light: "purple.100" }}>print(&quot;{locale === 'en' ? 'Hello ' : 'Hallo '}&quot; + name + &quot;!&quot;)</Code>
                    <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }} mt={1}>
                      {t('example.line3')}
                    </Text>
                  </Box>

                  <Box bg={{ base: "gray.800", _light: "green.50" }} p={3} borderRadius="md" borderLeft="3px solid" borderLeftColor="green.400">
                    <Code fontSize="xs" bg="transparent" color={{ base: "gray.400", _light: "gray.500" }}>{locale === 'en' ? 'Line 7:' : 'Zeile 7:'}</Code>
                    <Code fontSize="sm" mx={2} bg={{ base: "gray.700", _light: "green.100" }}>{locale === 'en' ? 'age' : 'alter'} = 25</Code>
                    <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }} mt={1}>
                      {t('example.line7')}
                    </Text>
                  </Box>

                  <Box bg={{ base: "gray.800", _light: "orange.50" }} p={3} borderRadius="md" borderLeft="3px solid" borderLeftColor="orange.400">
                    <Code fontSize="xs" bg="transparent" color={{ base: "gray.400", _light: "gray.500" }}>{locale === 'en' ? 'Line 8:' : 'Zeile 8:'}</Code>
                    <Code fontSize="sm" mx={2} bg={{ base: "gray.700", _light: "orange.100" }}>{locale === 'en' ? 'next_year' : 'naechstes_jahr'} = {locale === 'en' ? 'age' : 'alter'} + 1</Code>
                    <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }} mt={1}>
                      {t('example.line8')}
                    </Text>
                  </Box>

                  <Box bg={{ base: "gray.800", _light: "red.50" }} p={3} borderRadius="md" borderLeft="3px solid" borderLeftColor="red.400">
                    <Code fontSize="xs" bg="transparent" color={{ base: "gray.400", _light: "gray.500" }}>{locale === 'en' ? 'Line 9:' : 'Zeile 9:'}</Code>
                    <Code fontSize="sm" mx={2} bg={{ base: "gray.700", _light: "red.100" }}>str({locale === 'en' ? 'next_year' : 'naechstes_jahr'})</Code>
                    <Text fontSize="sm" color={{ base: "gray.300", _light: "gray.700" }} mt={1}>
                      {t('example.line9')}
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>

        {/* Tips */}
        <Box bg={{ base: "yellow.900", _light: "yellow.50" }} border="1px solid" borderColor={{ base: "yellow.500", _light: "yellow.400" }} p={6} borderRadius="lg">
          <VStack gap={3}>
            <Heading size="md" color={{ base: "yellow.200", _light: "yellow.700" }}>
              {t('tips.title')}
            </Heading>
            <VStack align="start" gap={2}>
              <Text color={{ base: "yellow.100", _light: "yellow.800" }} fontSize="sm">
                <strong>{t('tips.shortcut')}</strong>
              </Text>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}
