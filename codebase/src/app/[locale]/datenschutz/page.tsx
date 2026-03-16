'use client';

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Separator,
  Link as ChakraLink,
} from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';
import { ArrowLeft } from 'lucide-react';

const DataPrivacyPage: FC = () => {
  return (
    <Container maxW="4xl" py={{ base: '8', md: '16' }} px={{ base: '4', sm: '8' }}>
      {/* Back to Login Link */}
      <ChakraLink asChild mb={8} display="inline-flex" alignItems="center" gap={2} color="blue.400" _hover={{ color: 'blue.300' }}>
        <NextLink href="/login">
          <ArrowLeft size={18} />
          Zurück zum Login / Back to Login
        </NextLink>
      </ChakraLink>

      {/* German Version */}
      <Box
        py="8"
        px={{ base: '4', sm: '10' }}
        bg="var(--bgAnthrazitDark)"
        boxShadow="xl"
        borderRadius="xl"
        color="white"
        mb={8}
      >
        <VStack align="stretch" gap={6}>
          <Heading size="2xl" textAlign="center" mb={4}>
            Datenschutzhinweise für die Teilnahme an der wissenschaftlichen Studie
          </Heading>

          <Text color="gray.400" textAlign="center" fontSize="sm">
            Stand: Dezember 2025
          </Text>

          {/* 1. Einleitung und Verantwortlicher */}
          <Box>
            <Heading size="lg" mb={3}>
              1. Einleitung und Verantwortlicher
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              Diese Lernplattform wurde im Rahmen einer Bachelorarbeit an der FH Aachen entwickelt.
              Ziel ist die Erforschung KI-gestützter Lernmethoden in der Programmierung.
            </Text>
            <Text color="gray.300" lineHeight="tall" mb={2}>
              Verantwortlicher für die Datenverarbeitung im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:
            </Text>
            <Box pl={4} borderLeft="2px solid" borderColor="blue.400" py={2}>
              <Text color="white" fontWeight="semibold">Kacper Cömlek</Text>
              <Text color="gray.300">E-Mail: kacper.coemlek@alumni.fh-aachen.de</Text>
            </Box>
          </Box>

          {/* 2. Zweck der Verarbeitung */}
          <Box>
            <Heading size="lg" mb={3}>
              2. Zweck der Verarbeitung und Rechtsgrundlage
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              Die Erhebung deiner Daten dient ausschließlich dem wissenschaftlichen Zweck, die Effektivität
              von KI-Unterstützung beim Lernen zu analysieren. Kommerzielle Interessen werden nicht verfolgt.
            </Text>
            <Text color="gray.300" lineHeight="tall">
              Die Verarbeitung deiner personenbezogenen Daten erfolgt auf Grundlage deiner ausdrücklichen{' '}
              <Text as="span" fontWeight="semibold" color="white">Einwilligung gemäß Art. 6 Abs. 1 lit. a DSGVO</Text>.
              Diese Einwilligung erteilst du durch die Registrierung und aktive Nutzung der Plattform.
            </Text>
          </Box>

          {/* 3. Welche Daten wir erfassen */}
          <Box>
            <Heading size="lg" mb={3}>
              3. Welche Daten wir erfassen
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              Um die Lernplattform bereitzustellen und die Forschungsfragen zu beantworten, erfassen wir folgende Daten:
            </Text>
            <VStack align="stretch" gap={3} pl={4} color="gray.300">
              <Text>
                <Text as="span" fontWeight="semibold" color="white">1. Zugangsdaten:</Text>{' '}
                Benutzername und Passwort (verschlüsselt via Google Firebase Authentication) zur Erstellung deines Benutzerkontos.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">2. Demografische Daten:</Text>{' '}
                Freiwillige Angaben (z.B. Altersgruppe, Beschäftigungsstatus), sofern abgefragt.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">3. Lernfortschrittsdaten:</Text>{' '}
                Bearbeitete Aufgaben, benötigte Zeit, Fehlerquoten, Anzahl der Versuche und erreichte Lernstufen.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">4. Interaktionsdaten:</Text>{' '}
                Chat-Verläufe mit dem KI-Assistenten, gestellte Fragen und erhaltene Antworten.
              </Text>
            </VStack>
          </Box>

          {/* 4. Einsatz von Drittanbietern */}
          <Box>
            <Heading size="lg" mb={3}>
              4. Einsatz von Drittanbietern (Datenweitergabe)
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={4}>
              Damit die Plattform funktioniert, nutzen wir technische Dienstleister. Hierbei kann es zu einer
              Datenübermittlung in Drittländer (z.B. USA) kommen.
            </Text>

            <Box mb={4}>
              <Heading size="md" mb={2} color="blue.300">
                4.1 Google Firebase (Hosting & Datenbank)
              </Heading>
              <Text color="gray.300" lineHeight="tall" mb={2}>
                Wir nutzen Dienste von <Text as="span" fontWeight="semibold">Google Firebase</Text> (Google Ireland Limited / Google LLC, USA) für:
              </Text>
              <VStack align="stretch" gap={1} pl={4} color="gray.300" mb={2}>
                <Text>• Die Authentifizierung der Nutzer (Login)</Text>
                <Text>• Die Speicherung der Lerndaten in einer Echtzeit-Datenbank (Firestore)</Text>
                <Text>• Das Hosting der Webanwendung</Text>
              </VStack>
              <Text color="gray.300" lineHeight="tall">
                Google verarbeitet Daten in unserem Auftrag. Durch die Nutzung von Google-Diensten können Daten in die USA
                übertragen werden. Google sichert die Einhaltung des Datenschutzes durch Standardvertragsklauseln ab.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2} color="blue.300">
                4.2 OpenAI (KI-Funktionen)
              </Heading>
              <Text color="gray.300" lineHeight="tall" mb={2}>
                Zur Generierung von Hilfestellungen und Feedback nutzen wir die API von{' '}
                <Text as="span" fontWeight="semibold">OpenAI</Text> (OpenAI, L.L.C., San Francisco, USA).
              </Text>
              <VStack align="stretch" gap={2} pl={4} color="gray.300" mb={2}>
                <Text>
                  <Text as="span" fontWeight="semibold" color="white">Was wird übertragen?</Text>{' '}
                  Wenn du den KI-Assistenten nutzt, wird der Text deiner Anfrage sowie der Kontext der aktuellen Aufgabe an OpenAI gesendet.
                </Text>
              </VStack>
              <Box bg="orange.900" p={3} borderRadius="md" borderLeft="3px solid" borderColor="orange.400">
                <Text color="orange.100" fontWeight="semibold">
                  ⚠️ Wichtig: Bitte gib keine persönlichen Daten (wie deinen Namen, Telefonnummer oder Adressen) in das Chat-Fenster ein.
                </Text>
              </Box>
            </Box>
          </Box>

          {/* 5. Speicherdauer */}
          <Box>
            <Heading size="lg" mb={3}>
              5. Speicherdauer
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              Die erhobenen Daten werden für die Dauer der Bearbeitung und Bewertung der Bachelorarbeit gespeichert.
              Nach Abschluss des Prüfungsverfahrens werden die Daten entweder vollständig gelöscht oder so anonymisiert,
              dass kein Rückschluss auf deine Person mehr möglich ist (z.B. für die Veröffentlichung von Forschungsergebnissen).
            </Text>
          </Box>

          {/* 6. Deine Rechte */}
          <Box>
            <Heading size="lg" mb={3}>
              6. Deine Rechte
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              Da die Teilnahme an dieser Studie freiwillig ist, hast du jederzeit folgende Rechte:
            </Text>
            <VStack align="stretch" gap={3} pl={4} color="gray.300">
              <Text>
                <Text as="span" fontWeight="semibold" color="white">Widerruf:</Text>{' '}
                Du kannst deine Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen.
                Schreibe dazu eine formlose E-Mail an den Verantwortlichen. Dein Account und deine Daten werden dann umgehend gelöscht.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">Auskunft:</Text>{' '}
                Du kannst Auskunft über die zu deiner Person gespeicherten Daten verlangen.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">Löschung:</Text>{' '}
                Du kannst die Löschung deiner gespeicherten Daten verlangen.
              </Text>
            </VStack>
          </Box>

          {/* 7. Hinweis zur Datensicherheit */}
          <Box>
            <Heading size="lg" mb={3}>
              7. Hinweis zur Datensicherheit
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              Wir setzen technische Maßnahmen ein (z.B. SSL-Verschlüsselung, gesicherte Datenbankzugriffe),
              um deine Daten vor dem Zugriff unbefugter Dritter zu schützen.
            </Text>
          </Box>
        </VStack>
      </Box>

      <Separator borderColor="gray.600" />

      {/* English Version */}
      <Box
        py="8"
        px={{ base: '4', sm: '10' }}
        bg="var(--bgAnthrazitDark)"
        boxShadow="xl"
        borderRadius="xl"
        color="white"
        mt={8}
      >
        <VStack align="stretch" gap={6}>
          <Heading size="2xl" textAlign="center" mb={4}>
            Privacy Policy for Participation in the Scientific Study
          </Heading>

          <Text color="gray.400" textAlign="center" fontSize="sm">
            Last updated: December 2025
          </Text>

          {/* 1. Introduction and Controller */}
          <Box>
            <Heading size="lg" mb={3}>
              1. Introduction and Data Controller
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              This learning platform was developed as part of a bachelor thesis at FH Aachen University of Applied Sciences.
              The goal is to research AI-assisted learning methods in programming.
            </Text>
            <Text color="gray.300" lineHeight="tall" mb={2}>
              The controller responsible for data processing under the General Data Protection Regulation (GDPR) is:
            </Text>
            <Box pl={4} borderLeft="2px solid" borderColor="blue.400" py={2}>
              <Text color="white" fontWeight="semibold">Kacper Cömlek</Text>
              <Text color="gray.300">Email: kacper.coemlek@alumni.fh-aachen.de</Text>
            </Box>
          </Box>

          {/* 2. Purpose of Processing */}
          <Box>
            <Heading size="lg" mb={3}>
              2. Purpose of Processing and Legal Basis
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              The collection of your data serves exclusively the scientific purpose of analyzing the effectiveness
              of AI support in learning. No commercial interests are pursued.
            </Text>
            <Text color="gray.300" lineHeight="tall">
              The processing of your personal data is based on your explicit{' '}
              <Text as="span" fontWeight="semibold" color="white">consent pursuant to Art. 6 (1) (a) GDPR</Text>.
              You provide this consent by registering and actively using the platform.
            </Text>
          </Box>

          {/* 3. What Data We Collect */}
          <Box>
            <Heading size="lg" mb={3}>
              3. What Data We Collect
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              To provide the learning platform and answer the research questions, we collect the following data:
            </Text>
            <VStack align="stretch" gap={3} pl={4} color="gray.300">
              <Text>
                <Text as="span" fontWeight="semibold" color="white">1. Access data:</Text>{' '}
                Username and password (encrypted via Google Firebase Authentication) to create your user account.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">2. Demographic data:</Text>{' '}
                Voluntary information (e.g., age group, employment status), if requested.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">3. Learning progress data:</Text>{' '}
                Completed tasks, time required, error rates, number of attempts, and learning levels achieved.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">4. Interaction data:</Text>{' '}
                Chat logs with the AI assistant, questions asked and answers received.
              </Text>
            </VStack>
          </Box>

          {/* 4. Use of Third Parties */}
          <Box>
            <Heading size="lg" mb={3}>
              4. Use of Third-Party Services (Data Sharing)
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={4}>
              To operate the platform, we use technical service providers. This may involve data transfer to
              third countries (e.g., USA).
            </Text>

            <Box mb={4}>
              <Heading size="md" mb={2} color="blue.300">
                4.1 Google Firebase (Hosting & Database)
              </Heading>
              <Text color="gray.300" lineHeight="tall" mb={2}>
                We use services from <Text as="span" fontWeight="semibold">Google Firebase</Text> (Google Ireland Limited / Google LLC, USA) for:
              </Text>
              <VStack align="stretch" gap={1} pl={4} color="gray.300" mb={2}>
                <Text>• User authentication (login)</Text>
                <Text>• Storage of learning data in a real-time database (Firestore)</Text>
                <Text>• Hosting of the web application</Text>
              </VStack>
              <Text color="gray.300" lineHeight="tall">
                Google processes data on our behalf. Through the use of Google services, data may be transferred to the USA.
                Google ensures compliance with data protection through standard contractual clauses.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2} color="blue.300">
                4.2 OpenAI (AI Features)
              </Heading>
              <Text color="gray.300" lineHeight="tall" mb={2}>
                To generate assistance and feedback, we use the API from{' '}
                <Text as="span" fontWeight="semibold">OpenAI</Text> (OpenAI, L.L.C., San Francisco, USA).
              </Text>
              <VStack align="stretch" gap={2} pl={4} color="gray.300" mb={2}>
                <Text>
                  <Text as="span" fontWeight="semibold" color="white">What is transmitted?</Text>{' '}
                  When you use the AI assistant, the text of your request and the context of the current task is sent to OpenAI.
                </Text>
              </VStack>
              <Box bg="orange.900" p={3} borderRadius="md" borderLeft="3px solid" borderColor="orange.400">
                <Text color="orange.100" fontWeight="semibold">
                  ⚠️ Important: Please do not enter personal data (such as your name, phone number, or addresses) in the chat window.
                </Text>
              </Box>
            </Box>
          </Box>

          {/* 5. Storage Duration */}
          <Box>
            <Heading size="lg" mb={3}>
              5. Storage Duration
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              The collected data will be stored for the duration of the processing and evaluation of the bachelor thesis.
              After completion of the examination procedure, the data will either be completely deleted or anonymized
              so that no inference to your person is possible (e.g., for publishing research results).
            </Text>
          </Box>

          {/* 6. Your Rights */}
          <Box>
            <Heading size="lg" mb={3}>
              6. Your Rights
            </Heading>
            <Text color="gray.300" lineHeight="tall" mb={3}>
              Since participation in this study is voluntary, you have the following rights at any time:
            </Text>
            <VStack align="stretch" gap={3} pl={4} color="gray.300">
              <Text>
                <Text as="span" fontWeight="semibold" color="white">Withdrawal:</Text>{' '}
                You can withdraw your consent at any time with effect for the future.
                To do so, send an informal email to the data controller. Your account and data will then be deleted immediately.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">Information:</Text>{' '}
                You can request information about the data stored about you.
              </Text>
              <Text>
                <Text as="span" fontWeight="semibold" color="white">Deletion:</Text>{' '}
                You can request the deletion of your stored data.
              </Text>
            </VStack>
          </Box>

          {/* 7. Data Security Notice */}
          <Box>
            <Heading size="lg" mb={3}>
              7. Data Security Notice
            </Heading>
            <Text color="gray.300" lineHeight="tall">
              We implement technical measures (e.g., SSL encryption, secured database access)
              to protect your data from unauthorized access by third parties.
            </Text>
          </Box>
        </VStack>
      </Box>

      {/* Back to Login Link at bottom */}
      <Box textAlign="center" mt={8}>
        <ChakraLink asChild display="inline-flex" alignItems="center" gap={2} color="blue.400" _hover={{ color: 'blue.300' }}>
          <NextLink href="/login">
            <ArrowLeft size={18} />
            Zurück zum Login / Back to Login
          </NextLink>
        </ChakraLink>
      </Box>
    </Container>
  );
};

export default DataPrivacyPage;
