"use client";

import {
	Badge,
	Box,
	Button,
	Container,
	Flex,
	HStack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { Tooltip } from "@/components/ui/tooltip";

import Editor from "@monaco-editor/react";
import React from "react";
import { useEffect } from "react";
import { LuArrowRight } from "react-icons/lu";
import { ChatSystemWithCourseContext } from "@/components/chat/ChatSystem";
import { TutorIntroModal } from "@/components/chat/TutorIntroModal";
import Confetti from "@/components/ui/Confetti";
import { useColorMode } from "@/components/ui/color-mode";
import { TaskContent } from "@/components/course/TaskContent";
import { DrillModalV2 } from "@/components/drills/DrillModalV2";
import type { CourseTask, DrillSession, TaskResult } from "@/types/courseTypes";
import useEditor from "@/util/hooks/useEditor";
import usePythonRunner from "@/util/hooks/usePythonRunner";
import { runPythonCode, classifyPythonError, containsError, extractErrorMessage } from "@/util/runPythonCode";
import { validateSolutionWithTracking } from "@/util/validateSolution";
import { CourseContextProvider, useCourseContext } from "@/context/CourseContext";
import { useUser } from "@/context/UserContext";
import { logCodeExecution, logStepComplete, logStepSnapshot, logCourseComplete } from "@/db/eventTracking";
import {
	showCorrectSolutionToast,
	showIncorrectSolutionToast,
	showPythonErrorToast,
} from "@/util/hooks/useStandardToaster";
import { useLocale } from "next-intl";
import { selectStaticDrills } from "@/utils/drillSelection";
import { getCompletedDrillIds, getDrilledSteps, markStepDrilled, markDrillCompleted, saveDrillSession, incrementDrillAttempts, getDrillAttemptCounts, getActiveResponseId, setActiveResponseId } from "../../lib/firebase/drillTracking";
import { generateDrillIds } from "@/utils/drillSelection";
import {
	getLearningProfile,
	initializeLearningProfile,
	introduceTopics,
	processError,
	processCorrect,
	processIncorrect,
} from "../../lib/firebase/learningProfileTracking";
import type { UserLearningProfile } from "@/types/learningProfile";
import { selectDrillsFromPoolWithAI } from "@/actions/aiDrillSelectionFromPoolAction";
import { logEvent, getOrCreateSession } from "@/db/eventTracking";
import { Timestamp } from "firebase/firestore";
import { useTranslations } from "next-intl";

/**
 * Props für die CourseLayout Komponente
 * Hauptlayout für die interaktive Python-Lernumgebung
 */
interface CourseLayoutProps {
	courseId: string; // ID des Kurses (z.B. "bmi-calculator", "interest-calculator")
	title: string; // Titel des aktuellen Kurses
	step: number; // Aktuelle Schrittnummer im Kurs
	courseTask: CourseTask | null; // Aktuelle Aufgabe mit Lösungskriterien
	defaultCode: string; // Starter-Code für den Editor
	onNextStep?: () => void; // Callback für Navigation zum nächsten Schritt
	onPrevStep?: () => void; // Callback für Navigation zum vorherigen Schritt
	isFirstStep?: boolean; // Indikator für ersten Schritt
	isLastStep?: boolean; // Indikator für letzten Schritt
	isStepAlreadyCompleted?: boolean; // Ob dieser Step bereits früher gelöst wurde
	totalSteps?: number; // Gesamtanzahl der Steps im Kurs
	completedSteps?: number[]; // Array der bereits gelösten Steps
	onNavigateToStep?: (step: number) => void; // Callback für direkte Step-Navigation
	stepTitles?: string[]; // Titel aller Steps für Tooltip-Anzeige
}

/**
 * CourseLayout Komponente - Modernisiert
 *
 * Zentrale Layout-Komponente für die Python-Lernumgebung.
 * Integriert Code-Editor, Python-Interpreter, Tutorial-Drawer und Konsolen-Output.
 *
 * Features:
 * - Moderne, responsive UI mit besserer Raumaufteilung
 * - Floating Action Panel für alle wichtigen Controls
 * - Optimierte Editor-Positionierung
 * - Verbesserte Navigation und UX
 */
export default function CourseLayout({
	courseId,
	title,
	step,
	courseTask,
	defaultCode,
	onNextStep,
	onPrevStep,
	isFirstStep = false,
	isLastStep = false,
	isStepAlreadyCompleted = false,
	totalSteps = 0,
	completedSteps = [],
	onNavigateToStep,
	stepTitles = [],
}: CourseLayoutProps) {
	return (
		<CourseContextProvider>
			<CourseLayoutInner
				courseId={courseId}
				title={title}
				step={step}
				courseTask={courseTask}
				defaultCode={defaultCode}
				onNextStep={onNextStep}
				onPrevStep={onPrevStep}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
				isStepAlreadyCompleted={isStepAlreadyCompleted}
				totalSteps={totalSteps}
				completedSteps={completedSteps}
				onNavigateToStep={onNavigateToStep}
				stepTitles={stepTitles}
			/>
		</CourseContextProvider>
	);
}

function CourseLayoutInner({
	courseId,
	title,
	step,
	courseTask,
	defaultCode,
	onNextStep,
	onPrevStep,
	isFirstStep = false,
	isLastStep = false,
	isStepAlreadyCompleted = false,
	totalSteps = 0,
	completedSteps = [],
	onNavigateToStep,
	stepTitles = [],
}: CourseLayoutProps) {
	// Hooks für Python-Interpreter und Editor-Funktionalität
	const { pyodide, isLoading: isPyodideLoading, error: pyodideError } = usePythonRunner();
	const { handleEditorMount, getFormattedCode } = useEditor();
	const { colorMode } = useColorMode();
	const { user, aiChatTutorIsEnabled, tutorIntroCompleted } = useUser();
	const t = useTranslations('course');
	const locale = useLocale();

	// TutorIntroModal State
	const [showTutorIntro, setShowTutorIntro] = React.useState(false);

	// Show TutorIntroModal for AI users who haven't completed it
	React.useEffect(() => {
		if (user && aiChatTutorIsEnabled && !tutorIntroCompleted) {
			setShowTutorIntro(true);
		}
	}, [user, aiChatTutorIsEnabled, tutorIntroCompleted]);

	// Course Context Hook
	const courseContextHook = useCourseContext();
	const {
		setCourseInfo,
		setTask,
		setCodeInfo,
		setConsoleOutput,
		resetHelpRequests,
		incrementCodeExecution,
		helpRequestCount,
		currentHintLevel,
		codeExecutionCount,
	} = courseContextHook;

	// State für Code-Verwaltung und Feedback
	const [output, setOutput] = React.useState<string>(""); // Konsolen-Output
	const [code, setCode] = React.useState<string>(defaultCode); // Aktueller Code im Editor
	const [isValidSolution, setIsValidSolution] = React.useState<boolean>(false); // Lösungsstatus
	const [showConfetti, setShowConfetti] = React.useState<boolean>(false); // Konfetti-Animation
	const [highlightOutput, setHighlightOutput] = React.useState<boolean>(false); // Output-Highlight Animation

	// State für Drill-System (V2: State wird hier gehalten für Persistenz beim Schließen/Öffnen)
	const [showDrill, setShowDrill] = React.useState<boolean>(false);
	const [drillSession, setDrillSession] = React.useState<DrillSession | null>(null);
	const [isDrillLoading, setIsDrillLoading] = React.useState<boolean>(false);
	const [isStepAlreadyDrilled, setIsStepAlreadyDrilled] = React.useState<boolean>(false);
	// V2: Drill-Fortschritt State (bleibt beim Schließen/Öffnen erhalten)
	const [drillCurrentTask, setDrillCurrentTask] = React.useState<1 | 2>(1);
	const [drillMcqResult, setDrillMcqResult] = React.useState<TaskResult | null>(null);
	const [drillCodeResult, setDrillCodeResult] = React.useState<TaskResult | null>(null);
	const [drillModalOpen, setDrillModalOpen] = React.useState<boolean>(false);

	// Learning Profile State für AI-gesteuerte Drills
	const [learningProfile, setLearningProfile] = React.useState<UserLearningProfile | null>(null);
	const [learningProfileLoaded, setLearningProfileLoaded] = React.useState<boolean>(false);

	// Refs für Editor und Pyodide-Instanz
	const editorRef = React.useRef<any>(null); // Referenz zur Monaco Editor Instanz
	const pyodideRef = React.useRef<any>(null); // Referenz zur aktuellen Pyodide Instanz
	const shownDrillSteps = React.useRef<Set<number>>(new Set()); // Tracks which steps already showed a drill
	const stepStartTimeRef = React.useRef<Date>(new Date()); // Tracks when current step was started

	// Halte pyodideRef immer aktuell für Keyboard-Shortcuts
	React.useEffect(() => {
		pyodideRef.current = pyodide;
	}, [pyodide]);

	// Update Course Context - Course Info + Reset Help Requests bei Step-Wechsel
	React.useEffect(() => {
		setCourseInfo({
			courseId,
			courseName: title,
			step,
		});

		// Reset help requests and code executions bei Step-Wechsel
		resetHelpRequests();

		// Reset step start time for duration tracking
		stepStartTimeRef.current = new Date();

		// // console.log(`📚 Step-Wechsel: ${courseId} Step ${step} - Help Requests zurückgesetzt`);
	}, [courseId, title, step, setCourseInfo, resetHelpRequests]);

	// Log step snapshot at step START (for research metrics)
	React.useEffect(() => {
		const logStartSnapshot = async () => {
			if (!user?.userId || !learningProfileLoaded || !learningProfile) return;

			try {
				await logStepSnapshot(
					user.userId,
					courseId,
					`step-${step}`,
					step,
					"start",
					learningProfile.performanceScore,
					learningProfile.topicWeights,
					learningProfile.errorHistory?.length ?? 0,
					courseTask?.topics ?? []
				);
				console.log(`📊 [Snapshot] Step ${step} START logged`);
			} catch (error) {
				console.error('❌ Error logging step start snapshot:', error);
			}
		};

		logStartSnapshot();
	}, [user?.userId, learningProfileLoaded, learningProfile, courseId, step, courseTask?.topics]);

	// Prüfe ob dieser Step bereits gedrilled wurde
	React.useEffect(() => {
		const checkDrilledStatus = async () => {
			if (!user?.userId) return;
			const stepId = `${courseId}-step-${step}`;
			const drilledSteps = await getDrilledSteps(user.userId);
			const alreadyDrilled = drilledSteps.includes(stepId);
			setIsStepAlreadyDrilled(alreadyDrilled);
			console.log(`[Drill Status] Step ${step}: ${alreadyDrilled ? 'bereits gedrilled' : 'noch nicht gedrilled'}`);
		};
		checkDrilledStatus();
	}, [courseId, step, user?.userId]);

	// Learning Profile: Laden oder Initialisieren bei User-Login
	React.useEffect(() => {
		const loadLearningProfile = async () => {
			if (!user?.userId) {
				setLearningProfile(null);
				setLearningProfileLoaded(false);
				return;
			}

			try {
				// Versuche Profil zu laden
				let profile = await getLearningProfile(user.userId);

				// Falls nicht vorhanden, initialisiere
				if (!profile) {
					profile = await initializeLearningProfile(user.userId);
					console.log(`🧠 [Learning Profile] Initialized for user: ${user.userId}`);
				} else {
					console.log(`🧠 [Learning Profile] Loaded:`, {
						performanceScore: profile.performanceScore,
						errorCount: profile.errorHistory.length,
						topics: Object.keys(profile.topicWeights).filter(
							(t) => profile!.topicWeights[t] !== -1
						),
					});
				}

				setLearningProfile(profile);
				setLearningProfileLoaded(true);
			} catch (error) {
				console.error(`🔴 [Learning Profile] Error loading:`, error);
				setLearningProfileLoaded(true); // Mark as loaded even on error
			}
		};

		loadLearningProfile();
	}, [user?.userId]);

	// Learning Profile: Topics einführen wenn Step geladen wird
	React.useEffect(() => {
		const introduceStepTopics = async () => {
			if (!user?.userId || !learningProfileLoaded || !courseTask?.topics) return;

			const topics = courseTask.topics;
			if (topics.length === 0) return;

			try {
				await introduceTopics(user.userId, topics);
				console.log(`🧠 [Learning Profile] Topics introduced: ${topics.join(", ")}`);

				// Reload profile to get updated weights
				const updatedProfile = await getLearningProfile(user.userId);
				if (updatedProfile) {
					setLearningProfile(updatedProfile);
				}
			} catch (error) {
				console.error(`🔴 [Learning Profile] Error introducing topics:`, error);
			}
		};

		introduceStepTopics();
	}, [user?.userId, learningProfileLoaded, courseTask?.topics, step]);

	// Update Course Context - Task
	React.useEffect(() => {
		setTask(courseTask);
	}, [courseTask, setTask]);

	// Update Course Context - Code Info
	React.useEffect(() => {
		const solutionString = courseTask?.solutionString;
		const solution = Array.isArray(solutionString)
			? solutionString
			: solutionString
				? [solutionString]
				: [];

		setCodeInfo({
			current: code,
			starter: defaultCode,
			solution,
		});
	}, [code, defaultCode, courseTask?.solutionString, setCodeInfo]);

	// Update Course Context - Console Output
	React.useEffect(() => {
		// Einfache Fehler-Detection: Enthält output "Error", "Traceback", etc.
		const hasError =
			output.includes("Error") ||
			output.includes("Traceback") ||
			output.includes("Exception");
		setConsoleOutput(output, hasError);
	}, [output, setConsoleOutput]);

	// State für verzögerte Navigation nach Drill
	const [pendingNavigation, setPendingNavigation] = React.useState<boolean>(false);

	// Drill-Session laden (wird aufgerufen wenn Nutzer zum nächsten Step will)
	const loadDrillSession = React.useCallback(async () => {
		if (isDrillLoading || !courseTask || !user?.userId) return false;

		const currentTopics = courseTask.topics || [];
		if (currentTopics.length === 0) {
			return false;
		}

		setIsDrillLoading(true);

		try {
			// Bestimme User-Gruppe basierend auf aiChatTutorIsEnabled
			// A = Statische Drills, B = AI-gesteuerte Auswahl
			const userGroup = user.aiChatTutorIsEnabled ? "B" : "A";

			console.log(`\n🎯 [DRILL TRIGGER] Step ${step} abgeschlossen`);
			console.log(`   User: ${user.userId}`);
			console.log(`   Gruppe: ${userGroup} (${userGroup === "A" ? "Statisch" : "AI-gesteuert"})`);
			console.log(`   Course: ${courseId}`);
			console.log(`   Topics: ${currentTopics.join(", ")}`);

			let drills;
			let difficultyRecommendation = undefined;
			let aiSelectionReasoning: string | undefined = undefined;

			if (userGroup === "A") {
				// Gruppe A: Statische Drills
				const completedDrillIds = await getCompletedDrillIds(user.userId);
				console.log(`   StepId: ${courseId}-step-${step}`);
				drills = selectStaticDrills({ courseId, step, topics: currentTopics, completedDrillIds, locale: locale as "de" | "en" });

				if (!drills) {
					console.error("[Drill Trigger] No static drills found for topics:", currentTopics);
					setIsDrillLoading(false);
					return false;
				}
			} else {
				// Gruppe B: AI-gesteuerte Drill-Auswahl aus STATISCHEM Pool
				// Die KI wählt aus dem gleichen Pool wie Gruppe A, aber intelligent statt random
				console.log(`🧠 [AI-DRILL] Starting AI-based drill selection from static pool...`);

				const completedDrillIds = await getCompletedDrillIds(user.userId);
				const drillAttemptCounts = await getDrillAttemptCounts(user.userId);

				// Hole Chat-Continuation-ID für unified AI context
				const previousResponseId = await getActiveResponseId(user.userId);
				console.log(`🔗 [AI-DRILL] Using previous_response_id for chat continuation: ${previousResponseId ? previousResponseId.substring(0, 20) + '...' : 'none (new session)'}`);

				// Hole Performance-Daten für die KI
				let profile = learningProfile;
				if (!profile) {
					profile = await getLearningProfile(user.userId);
				}

				// AI wählt aus dem kumulativen Pool (Steps 1 bis current)
				// WICHTIG: previous_response_id verbindet Drill-Selection mit Chat-Kontext!
				const aiResult = await selectDrillsFromPoolWithAI({
					courseId,
					currentStep: step,
					topics: currentTopics,
					userPerformance: {
						completedDrillIds,
						drillAttemptCounts, // Wie oft wurde jeder Drill schon gezeigt
						avgSuccessRate: profile?.performanceScore ?? 100,
						commonErrors: profile?.errorHistory?.slice(-5).map(e => e.errorType) ?? [],
					},
					previous_response_id: previousResponseId || undefined, // Chat-Continuation!
					locale: locale as "de" | "en",
				});

				if (aiResult.success && aiResult.mcq && aiResult.codeTask) {
					console.log(`🎯 [AI-DRILL] AI selected from static pool:`);
					console.log(`   MCQ: ${aiResult.metadata?.selectedMcqId}`);
					console.log(`   Code: ${aiResult.metadata?.selectedCodeId}`);
					console.log(`   Reasoning: ${aiResult.reasoning}`);
					console.log(`   Pool Size: MCQ=${aiResult.metadata?.poolSize.mcq}, Code=${aiResult.metadata?.poolSize.code}`);
					aiSelectionReasoning = aiResult.reasoning;

					// Log AI-Drill-Selection Event für Research
					try {
						const sessionId = await getOrCreateSession(user.userId);
						await logEvent({
							userId: user.userId,
							sessionId,
							timestamp: Timestamp.now(),
							type: "ai_drill_selection",
							courseId,
							data: {
								step,
								topics: currentTopics,
								userGroup,
								// AI Selection Results (aus statischem Pool)
								selectedMcqId: aiResult.metadata?.selectedMcqId,
								selectedCodeId: aiResult.metadata?.selectedCodeId,
								reasoning: aiResult.reasoning || "",
								poolSize: aiResult.metadata?.poolSize,
								// User Profile Context
								performanceScore: profile?.performanceScore ?? 100,
								recentErrorCount: profile?.errorHistory?.length ?? 0,
								// Metadata
								responseTimeMs: aiResult.metadata?.responseTime ?? 0,
								// Wichtig: Markiere als "from_static_pool" für Analyse
								selectionMethod: "ai_from_static_pool",
							},
						} as any);
						console.log(`📊 [Event] Logged ai_drill_selection (from static pool)`);
					} catch (logError) {
						console.error(`[Event] Failed to log ai_drill_selection:`, logError);
					}

					// Speichere neue Response-ID für Chat-Continuation
					if (aiResult.newResponseId) {
						await setActiveResponseId(user.userId, aiResult.newResponseId);
						console.log(`🔗 [AI-DRILL] Saved new response ID for chat continuation`);
					}

					// Drills direkt aus dem AI-Result verwenden
					drills = {
						mcq: aiResult.mcq,
						codeTask: aiResult.codeTask,
					};
				} else {
					console.warn(`[AI-DRILL] AI selection failed: ${aiResult.error}`);
					console.log(`[AI-DRILL] Falling back to static weighted selection`);
					// Fallback auf statische gewichtete Auswahl (wie Gruppe A)
					drills = selectStaticDrills({ courseId, step, topics: currentTopics, completedDrillIds, locale: locale as "de" | "en" });
				}

				if (!drills) {
					console.error("[Drill Trigger] No drills found");
					setIsDrillLoading(false);
					return false;
				}
			}

			// Erstelle Drill-Session
			const session: DrillSession = {
				id: `drill-${Date.now()}`,
				triggerStep: step,
				topics: currentTopics,
				userGroup,
				timestamp: new Date(),
				tasks: {
					mcq: drills.mcq,
					codeTask: drills.codeTask,
				},
				difficultyRecommendation,
				// Speichere AI-Begründung für Research
				...(aiSelectionReasoning && { aiReasoning: aiSelectionReasoning }),
			};

			setDrillSession(session);
			setShowDrill(true);
			// V2: Reset Drill-Fortschritt und öffne Modal
			setDrillCurrentTask(1);
			setDrillMcqResult(null);
			setDrillCodeResult(null);
			setDrillModalOpen(true);

			// Erhöhe Attempt-Counter für die gezeigten Drills (für Wiederholungs-Tracking)
			const drillIds = generateDrillIds({
				...session.tasks,
				topics: session.topics,
			});
			await incrementDrillAttempts(user.userId, drillIds);
			console.log(`[Drill] Attempt-Counter erhöht für:`, drillIds);

			return true;
		} catch (error) {
			console.error("[Drill Trigger] Error loading drill session:", error);
			return false;
		} finally {
			setIsDrillLoading(false);
		}
	}, [isDrillLoading, courseTask, user, step, learningProfile]);

	// Handler für "Nächster Schritt" / "Drill Task Lösen" - zeigt erst Drill, dann Navigation
	const handleNextStepWithDrill = React.useCallback(async () => {
		if (!onNextStep) return;

		// Log step complete with actual metrics BEFORE navigating
		// Track both first completions and retries
		if (user?.userId) {
			try {
				const durationSeconds = Math.floor((Date.now() - stepStartTimeRef.current.getTime()) / 1000);
				const avgHintLevel = helpRequestCount > 0 ? currentHintLevel : 0;
				const isRetry = isStepAlreadyCompleted;

				// Log END snapshot before step complete (for research metrics comparison)
				if (learningProfileLoaded && learningProfile) {
					await logStepSnapshot(
						user.userId,
						courseId,
						`step-${step}`,
						step,
						"end",
						learningProfile.performanceScore,
						learningProfile.topicWeights,
						learningProfile.errorHistory?.length ?? 0,
						courseTask?.topics ?? []
					);
					console.log(`📊 [Snapshot] Step ${step} END logged`);
				}

				await logStepComplete(
					user.userId,
					courseId,
					step.toString(),
					step,
					durationSeconds,
					helpRequestCount,
					avgHintLevel,
					codeExecutionCount,
					code, // finalCode from editor
					isRetry // Track whether this is a retry
				);
				console.log(`✅ Step complete tracked:`, {
					step,
					durationSeconds,
					helpRequests: helpRequestCount,
					avgHintLevel,
					codeExecutions: codeExecutionCount,
					isRetry,
				});

				// Log course complete when finishing the last step
				if (isLastStep) {
					await logCourseComplete(
						user.userId,
						courseId,
						totalSteps,
						durationSeconds, // Just this step's duration, total is computed from events
						helpRequestCount,
						avgHintLevel
					);
					console.log(`🎉 Course complete tracked: ${courseId}`);
				}
			} catch (error) {
				console.error('❌ Error tracking step complete:', error);
			}
		}

		const hasShownDrillForStep = shownDrillSteps.current.has(step);

		// Wenn Step bereits gedrilled wurde → direkt navigieren (kein erneutes Drill)
		if (isStepAlreadyDrilled) {
			console.log(`[Drill Skip] Step ${step} bereits gedrilled → direkt navigieren`);
			onNextStep();
			return;
		}

		// Wenn Drill noch nicht gezeigt wurde UND hasDrill aktiviert ist → Drill zeigen
		if (!hasShownDrillForStep && courseTask?.hasDrill === true && courseTask?.topics?.length) {
			shownDrillSteps.current.add(step);
			setPendingNavigation(true); // Merken dass wir nach Drill navigieren wollen
			const drillLoaded = await loadDrillSession();

			if (!drillLoaded) {
				// Kein Drill verfügbar → direkt navigieren
				setPendingNavigation(false);
				onNextStep();
			}
			// Sonst: Navigation passiert in DrillModal.onComplete
		} else {
			// Drill bereits gezeigt oder kein Drill nötig → direkt navigieren
			onNextStep();
		}
	}, [onNextStep, step, courseTask?.topics, loadDrillSession, isStepAlreadyDrilled, user?.userId, isStepAlreadyCompleted, helpRequestCount, currentHintLevel, codeExecutionCount, code, courseId, isLastStep, totalSteps]);

	/**
	 * Handler für Code-Änderungen im Editor
	 */
	const handleCodeChange = (value: string | undefined) => {
		if (value !== undefined) {
			setCode(value);
		}
	};

	/**
	 * Führt den Python-Code aus und validiert die Lösung
	 * Mit Learning Profile Tracking für AI-gesteuerte Drill-Auswahl
	 */
	const handleRunPythonCode = async () => {
		const currentPyodide = pyodideRef.current ?? pyodide;

		const formattedCode = getFormattedCode();

		// Track code execution count
		incrementCodeExecution();

		// Prüfe ob Pyodide geladen ist
		if (!currentPyodide) {
			if (pyodideError) {
				setOutput(
					`Error loading Python interpreter: ${pyodideError}\n\nPlease refresh the page or try a different browser.`,
				);
			} else if (isPyodideLoading) {
				setOutput(
					"Python interpreter is still loading. Please try again in a moment...",
				);
			} else {
				setOutput(
					"Python interpreter failed to load. Please refresh the page.",
				);
			}
			return;
		}

		// Trigger Output-Highlight Animation
		setHighlightOutput(true);
		setTimeout(() => setHighlightOutput(false), 1000);

		// Führe Python-Code aus
		const startTime = Date.now();
		const result = await runPythonCode(
			currentPyodide,
			formattedCode,
			setOutput,
		);
		const executionTime = Date.now() - startTime;

		// Track code execution
		if (user?.userId && courseId) {
			try {
				const isSuccess = !result.startsWith("Error:");
				const errorMessage = isSuccess ? undefined : result;

				await logCodeExecution(
					user.userId,
					courseId,
					step.toString(),
					step,
					formattedCode,
					isSuccess,
					errorMessage,
					executionTime
				);
				// // console.log('✅ Code execution tracked:', { success: isSuccess, executionTime });
			} catch (error) {
				console.error('❌ Error tracking code execution:', error);
				// Continue with code execution even if tracking fails
			}
		}

		// Ermittle aktuelles Topic für Tracking
		const currentTopic = courseTask?.topics?.[0] || "unknown";

		// Check for Python errors and show toast
		if (containsError(result)) {
			const errorType = classifyPythonError(result);
			const extractedErrorMsg = extractErrorMessage(result);

			// Show Python Error Toast (for all users)
			showPythonErrorToast(errorType, locale);

			// Learning Profile Tracking für Fehler (nur für eingeloggte User)
			if (user?.userId && learningProfileLoaded) {
				console.log(`🧠 [Learning Profile] Error detected:`, {
					errorType,
					topic: currentTopic,
					message: extractedErrorMsg.substring(0, 50),
				});

				try {
					const { newPerformanceScore, newTopicWeight } = await processError(
						user.userId,
						{
							courseId,
							step,
							errorType,
							errorMessage: extractedErrorMsg,
							topic: currentTopic,
							code: formattedCode,
						}
					);

					// Update lokalen State
					const updatedProfile = await getLearningProfile(user.userId);
					if (updatedProfile) {
						setLearningProfile(updatedProfile);
					}

					console.log(`🧠 [Learning Profile] Updated after error:`, {
						newPerformanceScore,
						newTopicWeight,
					});
				} catch (error) {
					console.error(`🔴 [Learning Profile] Error processing error:`, error);
				}
			}
		}

		// Validiere Lösung mit Tracking (inkl. solutionCode-Prüfung)
		const validationResult = validateSolutionWithTracking(
			result,
			code, // User-Code für solutionCode-Prüfung (Anti-Cheat)
			courseTask,
			currentTopic,
			{
				onCorrect: async (topic) => {
					// Learning Profile: Erfolg tracken
					if (user?.userId && learningProfileLoaded && !isValidSolution) {
						// Nur bei erstmaligem Erfolg tracken
						console.log(`🧠 [Learning Profile] Solution correct for topic: ${topic}`);

						try {
							const { newPerformanceScore, newTopicWeight } = await processCorrect(
								user.userId,
								topic
							);

							// Update lokalen State
							const updatedProfile = await getLearningProfile(user.userId);
							if (updatedProfile) {
								setLearningProfile(updatedProfile);
							}

							console.log(`🧠 [Learning Profile] Updated after success:`, {
								newPerformanceScore,
								newTopicWeight,
							});
						} catch (error) {
							console.error(`🔴 [Learning Profile] Error processing success:`, error);
						}
					}
				},
				onIncorrect: async (topic) => {
					// Validation-Fehler (Output nicht wie erwartet, aber kein Python-Error)
					// z.B. User schreibt 1,79 statt 1.79 → Tuple statt Float
					console.log(`🧠 [Learning Profile] Solution incorrect for topic: ${topic} (validation mismatch)`);

					if (user?.userId) {
						try {
							const { newPerformanceScore, newTopicWeight } = await processIncorrect(
								user.userId,
								topic
							);
							console.log(`🧠 [Learning Profile] Incorrect solution tracked:`, {
								topic,
								newPerformanceScore,
								newTopicWeight,
								note: "Weniger Strafe als bei Python-Error (-2 statt -5, +0.15 statt +0.3)",
							});
						} catch (err) {
							console.error(`🔴 [Learning Profile] Error tracking incorrect solution:`, err);
						}
					}

					// Show Incorrect Solution Toast
					showIncorrectSolutionToast(undefined, locale);
				},
			}
		);

		// UI-State aktualisieren
		setIsValidSolution(validationResult.isValid);

		// Toast und Konfetti nur bei validem Ergebnis (wie vorher)
		if (validationResult.isValid) {
			setShowConfetti(true);
			// Show Correct Solution Toast
			showCorrectSolutionToast(undefined, locale);
		}
	};

	// Globaler Keyboard-Handler für Ctrl+Enter
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const handleGlobalKeyDown = async (e: KeyboardEvent) => {
			// Wenn Drill Modal offen ist, ignoriere Ctrl+Enter komplett
			if (drillModalOpen) {
				return;
			}

			const activeElement = document.activeElement;
			const isInEditor = activeElement?.closest(".monaco-editor") !== null;

			if (isInEditor && (e.ctrlKey || e.metaKey) && e.key === "Enter") {
				e.preventDefault();
				e.stopPropagation();

				// Gleiche Logik wie Button: Wenn valide/completed → nächster Schritt, sonst → Code ausführen
				if (isValidSolution || isStepAlreadyCompleted) {
					handleNextStepWithDrill();
				} else {
					handleRunPythonCode();
				}
			}
		};

		window.addEventListener("keydown", handleGlobalKeyDown, true);
		return () => {
			window.removeEventListener("keydown", handleGlobalKeyDown, true);
		};
	}, [isValidSolution, isStepAlreadyCompleted, drillModalOpen, handleRunPythonCode]);

	return (
		<Box
			bg={{ base: "gray.900", _light: "gray.50" }}
			color={{ base: "white", _light: "gray.900" }}
			minH="calc(100vh - 85px)"
		>
			{/* Main Content Area - Split Screen Layout */}
			<Container maxW="full" p={0}>
				<Flex direction="row" alignItems="stretch">
					{/* Left Side: Course Title + Steps, Code Editor, Console */}
					<Box
						flex="1"
						display="flex"
						flexDirection="column"
						h="calc(100vh - 85px)"
						overflow="auto"
					>
						{/* Course Title + Step Navigation */}
						<Flex
							align="center"
							gap={4}
							px={6}
							py={3}
							borderBottom="1px"
							borderColor={{ base: "gray.700", _light: "gray.200" }}
							bg={{ base: "gray.850", _light: "gray.50" }}
						>
							<Text
								fontSize="lg"
								fontWeight="bold"
								color={{ base: "white", _light: "black" }}
								flexShrink={0}
							>
								{title}
							</Text>
							{totalSteps > 0 && (
								<HStack gap={2} flexWrap="wrap">
									{Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => {
										const isCompleted = completedSteps.includes(stepNum);
										const isCurrent = stepNum === step;
										const isAccessible = isCompleted || isCurrent;
										const stepTitle = stepTitles[stepNum - 1] || `Schritt ${stepNum}`;

										return (
											<Tooltip
												key={stepNum}
												content={stepTitle}
												positioning={{ placement: "top" }}
											>
												<Button
													size="sm"
													variant={isCurrent ? "solid" : "outline"}
													colorPalette={isCompleted ? "green" : isCurrent ? "blue" : "gray"}
													onClick={() => isAccessible && onNavigateToStep?.(stepNum)}
													disabled={!isAccessible || !onNavigateToStep}
													minW="36px"
													h="28px"
													px={2}
													fontSize="sm"
													fontWeight={isCurrent ? "bold" : "normal"}
													borderWidth={isCurrent ? "2px" : "1px"}
													borderColor={
														!isAccessible
															? { base: "gray.600", _light: "gray.400" }
															: undefined
													}
													opacity={isAccessible ? 1 : 0.5}
													cursor={isAccessible && onNavigateToStep ? "pointer" : "not-allowed"}
													_hover={
														isAccessible
															? {
																transform: "translateY(-1px)",
																boxShadow: "md",
															}
															: undefined
													}
													transition="all 0.2s"
												>
													{isCompleted && !isCurrent ? "✓" : stepNum}
												</Button>
											</Tooltip>
										);
									})}
								</HStack>
							)}
						</Flex>

						{/* Code Editor Section */}
						<Box p={6} pb={2} bg={{ base: "purple.900", _light: "purple.50" }}

						>
							<VStack gap={4} alignItems="stretch">
								{/* Editor Header with Run Button */}
								<Flex justify="space-between" align="center">
									<Text
										fontSize="md"
										fontWeight="bold"
										color={{ base: "gray.300", _light: "gray.600" }}
									>
										Python Code Editor
									</Text>
									<Button
										onClick={handleRunPythonCode}
										colorPalette="green"
										size="md"
										_hover={{ transform: "translateY(-1px)" }}
										transition="all 0.2s"
									>
										Code ausführen
									</Button>
								</Flex>

								{/* Monaco Editor - Fixed height, no scroll */}
								<Box
									borderRadius="lg"
									overflow="hidden"
									border="2px"
									borderColor={{ base: "purple.500", _light: "purple.400" }}
									bg={{ base: "purple.950", _light: "purple.50" }}
									h="600px"
								>
									<Editor
										defaultLanguage="python"
										height="600px"
										width="100%"
										defaultValue={defaultCode}
										options={{
											minimap: { enabled: false },
											quickSuggestions: true,
											suggestOnTriggerCharacters: true,
											lineNumbers: "on",
											scrollBeyondLastLine: false,
											automaticLayout: true,
											tabSize: 4,
											renderValidationDecorations: "on",
											rulers: [80],
											fontSize: 14,
											fontFamily:
												'JetBrains Mono, SF Mono, Monaco, Inconsolata, "Roboto Mono", source-code-pro, Menlo, "Courier New", monospace',
											padding: { top: 16, bottom: 16 },
											scrollbar: {
												vertical: "hidden",
												horizontal: "hidden",
												alwaysConsumeMouseWheel: false,
											},
										}}
										onMount={(editor, monaco) => {
											handleEditorMount(editor, monaco);
											editorRef.current = editor;

											// Autofocus the editor
											editor.focus();

											setTimeout(() => {
												if (code) handleCodeChange(code);
											}, 1000);
										}}
										language="python"
										onChange={handleCodeChange}
										value={code}
										theme={colorMode === "light" ? "vs" : "vs-dark"}
									/>
								</Box>

								{/* Keyboard Shortcut Hint */}
								<Text
									fontSize="xs"
									color={{ base: "gray.500", _light: "gray.500" }}
									textAlign="center"
								>
									{t('keyboardHintPrefix')}{" "}
									<Badge
										variant="outline"
										fontSize="xs"
										color={{ base: "gray.400", _light: "gray.600" }}
									>
										Ctrl + Enter
									</Badge>{" "}
									{t('keyboardHintSuffix')}
								</Text>
							</VStack>
						</Box>

						{/* Bottom: Console - Stretches to fill remaining height */}
						<Box
							flex="1"
							display="flex"
							flexDirection="column"
							borderTop="2px"
							borderColor={{ base: "green.500", _light: "green.400" }}
							bg={{ base: "green.800", _light: "green.50" }}
							p={4}
							position="relative"
							transition="all 0.3s ease"
							boxShadow={
								highlightOutput
									? isValidSolution
										? "0 0 0 3px rgba(72, 187, 120, 0.6)"
										: "0 0 0 3px rgba(239, 68, 68, 0.6)"
									: "none"
							}
						>
							{/* Console Header */}
							<Flex justify="space-between" align="center" mb={3}>
								<Text
									fontSize="md"
									fontWeight="bold"
									color={{ base: "gray.300", _light: "gray.600" }}
								>
									Python Output
								</Text>
								<HStack gap={2}>
									{(isValidSolution || isStepAlreadyCompleted) && (
										<Badge colorPalette="green" variant="solid">
											✓ {isStepAlreadyCompleted && !isValidSolution ? t('alreadySolved') : t('correct')}
										</Badge>
									)}
								</HStack>
							</Flex>

							{/* Console Output - Fills remaining space, scrollable */}
							<Box
								flex="1"
								minH={100}
								bg={{ base: "gray.900", _light: "white" }}
								borderRadius="md"
								p={4}
								fontFamily="JetBrains Mono, SF Mono, Monaco, Inconsolata, 'Roboto Mono', source-code-pro, Menlo, 'Courier New', monospace"
								fontSize="sm"
								border="1px"
								borderColor={{ base: "gray.600", _light: "gray.300" }}
							>
								{output ? (
									<Text
										color={{ base: "green.300", _light: "green.600" }}
										whiteSpace="pre-wrap"
									>
										{output}
									</Text>
								) : (
									<Text
										color={{ base: "gray.500", _light: "gray.500" }}
										fontStyle="italic"
									>
										{t('runCodePrompt')}
									</Text>
								)}
							</Box>
						</Box>
					</Box>

					{/* Right Side: Tutorial Panel - Independent scrolling */}
					<Box
						w="800px"
						borderLeft="3px"
						borderColor={{ base: "blue.500", _light: "blue.400" }}
						bg={{ base: "blue.950", _light: "blue.50" }}
						display="flex"
						flexDirection="column"
						h="calc(100vh - 85px)"
						overflow="hidden"
					>
						{/* Scrollable Tutorial Content - with padding for fixed buttons */}
						<Box flex="1" overflow="auto" p={4} pb="100px" minH={0}>
							{courseTask && (
								<TaskContent task={courseTask} currentStep={step} totalSteps={totalSteps} />
							)}
						</Box>
					</Box>
				</Flex>
			</Container>

			{/* Fixed Navigation Buttons - Always visible at bottom right */}
			{courseTask && (
				<VStack
					position="fixed"
					bottom={0}
					right={0}
					w="800px"
					gap={2}
					p={4}
					borderTop="1px"
					borderLeft="3px"
					borderColor={{ base: "gray.600", _light: "gray.300" }}
					borderLeftColor={{ base: "blue.500", _light: "blue.400" }}
					bg={{ base: "gray.900", _light: "gray.100" }}
					boxShadow={{ base: "0 -4px 20px rgba(0, 0, 0, 0.5)", _light: "0 -4px 12px rgba(0, 0, 0, 0.15)" }}
					zIndex={100}
				>
					<HStack w="full" justify="space-between">
						<Button
							onClick={onPrevStep}
							variant="solid"
							size="sm"
							disabled={isFirstStep}
							bg={{ base: "gray.600", _light: "gray.200" }}
							color={{ base: "white", _light: "gray.700" }}
							_hover={{ bg: { base: "gray.500", _light: "gray.300" } }}
							_disabled={{ opacity: 0.4, cursor: "not-allowed" }}
						>
							{t('previousStep')}
						</Button>
						<Text
							fontSize="xs"
							color={{ base: "gray.500", _light: "gray.500" }}
							textAlign="center"
							w="full"
						>
							{t('runCodeToCheck')}
						</Text>
						<Button
							onClick={async () => {
								// V2: Logik basierend auf Drill-Status
								if (showDrill && !drillModalOpen && drillMcqResult?.correct && drillCodeResult?.correct && drillSession) {
									// Drill vollständig abgeschlossen → speichern und navigieren
									if (user?.userId) {
										try {
											// 1. Speichere Drill-Session in Firebase
											await saveDrillSession(user.userId, drillSession, {
												mcqCorrect: drillMcqResult.correct,
												mcqAttempts: drillMcqResult.attempts,
												codeCorrect: drillCodeResult.correct,
												codeAttempts: drillCodeResult.attempts,
											});

											// 2. Markiere Drill-IDs als abgeschlossen (für Anti-Wiederholung)
											const drillIds = generateDrillIds({
												...drillSession.tasks,
												topics: drillSession.topics,
											});
											await markDrillCompleted(user.userId, drillIds);
											console.log(`[Drill] Drill-IDs als completed markiert:`, drillIds);

											// 3. Markiere Step als gedrilled
											const stepId = `${courseId}-step-${step}`;
											await markStepDrilled(user.userId, stepId);
											setIsStepAlreadyDrilled(true);
										} catch (error) {
											console.error(`[Drill] Fehler beim Speichern:`, error);
										}
									}

									// Reset Drill-State
									setShowDrill(false);
									setDrillSession(null);

									// Navigiere zum nächsten Schritt
									if (onNextStep) {
										onNextStep();
									}
								} else if (showDrill && !drillModalOpen) {
									// Drill noch nicht abgeschlossen → Modal wieder öffnen
									setDrillModalOpen(true);
								} else {
									handleNextStepWithDrill();
								}
							}}
							variant="solid"
							size={(isValidSolution || isStepAlreadyCompleted) ? "md" : "sm"}
							colorPalette={(showDrill && !drillModalOpen && drillMcqResult?.correct && drillCodeResult?.correct) ? "green" : (showDrill && !drillModalOpen) ? "blue" : (isValidSolution || isStepAlreadyCompleted) ? "green" : "blue"}
							disabled={!(isValidSolution || isStepAlreadyCompleted) || isDrillLoading}
							position="relative"
							transition="all 0.3s ease"
							boxShadow={
								(showDrill && !drillModalOpen && drillMcqResult?.correct && drillCodeResult?.correct)
									? "0 0 0 3px rgba(72, 187, 120, 0.4), 0 4px 12px rgba(72, 187, 120, 0.3)"
									: (showDrill && !drillModalOpen)
										? "0 0 0 3px rgba(66, 153, 225, 0.4), 0 4px 12px rgba(66, 153, 225, 0.3)"
										: isValidSolution
											? "0 0 0 3px rgba(72, 187, 120, 0.4), 0 4px 12px rgba(72, 187, 120, 0.3)"
											: "none"
							}
							_hover={
								(isValidSolution || isStepAlreadyCompleted)
									? {
										transform: "translateY(-2px)",
										boxShadow: (showDrill && !drillModalOpen)
											? "0 0 0 4px rgba(66, 153, 225, 0.5), 0 6px 16px rgba(66, 153, 225, 0.4)"
											: isValidSolution
												? "0 0 0 4px rgba(72, 187, 120, 0.5), 0 6px 16px rgba(72, 187, 120, 0.4)"
												: "0 0 0 2px rgba(72, 187, 120, 0.3)",
									}
									: undefined
							}
							animation={
								(showDrill && !drillModalOpen) || isValidSolution
									? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
									: undefined
							}
							css={
								(showDrill && !drillModalOpen) || isValidSolution
									? {
										"@keyframes pulse": {
											"0%, 100%": {
												boxShadow: (showDrill && !drillModalOpen)
													? "0 0 0 3px rgba(66, 153, 225, 0.4), 0 4px 12px rgba(66, 153, 225, 0.3)"
													: "0 0 0 3px rgba(72, 187, 120, 0.4), 0 4px 12px rgba(72, 187, 120, 0.3)",
											},
											"50%": {
												boxShadow: (showDrill && !drillModalOpen)
													? "0 0 0 5px rgba(66, 153, 225, 0.6), 0 6px 20px rgba(66, 153, 225, 0.5)"
													: "0 0 0 5px rgba(72, 187, 120, 0.6), 0 6px 20px rgba(72, 187, 120, 0.5)",
											},
										},
									}
									: undefined
							}
						>
							<HStack gap={2}>
								<Text>
									{/* V2: Button-Text basierend auf Drill-Status */}
									{(showDrill && !drillModalOpen && drillMcqResult?.correct && drillCodeResult?.correct)
										? t('continueCourse')
										: (showDrill && !drillModalOpen)
											? t('continueDrill')
											: isLastStep
												? t('finishCourse')
												: (isStepAlreadyDrilled || !courseTask?.hasDrill)
													? t('nextStepButton')
													: t('solveDrill')
									}
								</Text>
								{(isValidSolution || isStepAlreadyCompleted) && !(showDrill && !drillModalOpen) && <LuArrowRight size={16} />}
							</HStack>
						</Button>
					</HStack>
				</VStack>
			)}

			{/* Konfetti-Overlay für erfolgreiche Lösungen */}
			{showConfetti && (
				<Box
					position="fixed"
					top={0}
					left={0}
					w="full"
					h="full"
					pointerEvents="none"
					zIndex={1000}
				>
					<Confetti onComplete={() => setShowConfetti(false)} />
				</Box>
			)}

			{/* Drill Modal V2 für Part-Task Practice (mit integriertem Loading-Skeleton NUR für Gruppe B) */}
			{user?.userId && (
				// Gruppe B (AI): Zeige Modal sofort mit Skeleton während Loading
				// Gruppe A (statisch): Zeige Modal erst wenn Session geladen ist
				(user.aiChatTutorIsEnabled && isDrillLoading) || (showDrill && drillSession)
			) && (
					<DrillModalV2
						session={drillSession}
						userId={user.userId}
						courseId={courseId}
						isOpen={drillModalOpen || (isDrillLoading && user.aiChatTutorIsEnabled)}
						isLoading={isDrillLoading && user.aiChatTutorIsEnabled}
						onClose={() => setDrillModalOpen(false)}
						onComplete={async () => {
							setShowDrill(false);
							setDrillSession(null);
							setDrillModalOpen(false);

							// Markiere diesen Step als gedrilled
							const stepId = `${courseId}-step-${step}`;
							try {
								await markStepDrilled(user.userId, stepId);
								setIsStepAlreadyDrilled(true);
								console.log(`[Drill Complete] Step ${step} als gedrilled markiert`);
							} catch (error) {
								console.error(`[Drill Complete] Fehler beim Markieren:`, error);
							}

							// Nach Drill-Abschluss: Navigation zum nächsten Step wenn angefordert
							if (pendingNavigation && onNextStep) {
								setPendingNavigation(false);
								onNextStep();
							}
						}}
						currentTask={drillCurrentTask}
						setCurrentTask={setDrillCurrentTask}
						mcqResult={drillMcqResult}
						setMcqResult={setDrillMcqResult}
						codeResult={drillCodeResult}
						setCodeResult={setDrillCodeResult}
					/>
				)}

			{/* Chat-System für KI-Assistenz während des Kurses */}
			<ChatSystemWithCourseContext courseContext={courseContextHook} />

			{/* TutorIntroModal für AI-User die es noch nicht abgeschlossen haben */}
			<TutorIntroModal
				isOpen={showTutorIntro}
				onClose={() => setShowTutorIntro(false)}
			/>
		</Box>
	);
}
