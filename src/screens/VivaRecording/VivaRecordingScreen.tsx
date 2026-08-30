import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import {
  CameraView,
  useCameraPermissions,
  useMicrophonePermissions,
} from "expo-camera";

import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAssessment } from "../../context/AssessmentContext";
import { submitVivaEvidence } from "../../services/assessments/assessorSubmissionsApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RouteProps = RouteProp<RootStackParamList, "VivaRecording">;

const MAX_QUESTION_DURATION_SECONDS = 300;
const ANSWER_CHUNK_DURATION_SECONDS = 15;
const ANSWER_PAUSE_DURATION_SECONDS = 15;

type AnswerRecordingPhase =
  | "idle"
  | "recording"
  | "uploading"
  | "paused"
  | "manualPaused";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function VivaRecordingScreen() {
  const cameraRef = useRef<CameraView>(null);
  const sessionActiveRef = useRef(false);
  const manualPausedRef = useRef(false);
  const answerClipCountRef = useRef(0);

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { assessmentId, studentId, roundId, speaker } = route.params;
  const isAnswer = speaker === "answer";
  const { addVivaClip } = useAssessment();

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [phase, setPhase] = useState<AnswerRecordingPhase>("idle");
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [phaseSeconds, setPhaseSeconds] = useState(0);
  const [answerClipCount, setAnswerClipCount] = useState(0);

  useEffect(() => {
    if (!isAnswer || phase !== "recording") return;

    const interval = setInterval(() => {
      setPhaseSeconds((prev) =>
        Math.min(prev + 1, ANSWER_CHUNK_DURATION_SECONDS)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isAnswer, phase]);

  useEffect(() => {
    return () => {
      if (sessionActiveRef.current) {
        sessionActiveRef.current = false;
        cameraRef.current?.stopRecording();
      }
    };
  }, []);

  if (!cameraPermission || !microphonePermission) {
    return <View />;
  }

  if (!cameraPermission.granted || !microphonePermission.granted) {
    return (
      <Screen>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>
            Camera & Microphone Permission Required
          </Text>

          <Text style={styles.permissionText}>
            This app needs access to your camera and microphone to record
            the viva {isAnswer ? "answer" : "question"}.
          </Text>

          <AppButton
            title="Grant Permission"
            onPress={async () => {
              await requestCameraPermission();
              await requestMicrophonePermission();
            }}
          />
        </View>
      </Screen>
    );
  }

  const handleQuestionStart = async () => {
    if (!cameraRef.current) return;

    setIsRecording(true);

    try {
      const result = await cameraRef.current.recordAsync({
        maxDuration: MAX_QUESTION_DURATION_SECONDS,
      });

      setIsRecording(false);

      if (result?.uri) {
        navigation.navigate("VivaClipPreview", {
          assessmentId,
          studentId,
          roundId,
          speaker,
          videoUri: result.uri,
        });
      }
    } catch (error) {
      setIsRecording(false);
      console.error(error);
      Alert.alert("Error", "Failed to record video.");
    }
  };

  const runAnswerRecordingCycle = async () => {
    while (sessionActiveRef.current) {
      if (manualPausedRef.current) {
        setPhase("manualPaused");
        setPhaseSeconds(0);

        while (sessionActiveRef.current && manualPausedRef.current) {
          await sleep(250);
        }
      }

      if (!sessionActiveRef.current) break;

      setPhase("recording");
      setPhaseSeconds(0);

      try {
        const result = await cameraRef.current?.recordAsync({
          maxDuration: ANSWER_CHUNK_DURATION_SECONDS,
        });

        if (result?.uri) {
          setPhase("uploading");
          const clipNumber = answerClipCountRef.current + 1;
          const saved = await submitVivaEvidence({
            batchId: Number(assessmentId),
            studentId: Number(studentId),
            roundId: `${roundId}-answer-${clipNumber}`,
            speaker: "answer",
            videoUri: result.uri,
          });
          addVivaClip(studentId, roundId, "answer", result.uri, String(saved.id));
          answerClipCountRef.current = clipNumber;
          setAnswerClipCount(clipNumber);
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          "Upload failed",
          "Couldn't save the viva answer clip. Check your connection and try again."
        );
        sessionActiveRef.current = false;
      }

      if (!sessionActiveRef.current) break;

      if (manualPausedRef.current) continue;

      setPhase("paused");
      setPhaseSeconds(0);
      for (
        let seconds = 1;
        seconds <= ANSWER_PAUSE_DURATION_SECONDS && sessionActiveRef.current;
        seconds += 1
      ) {
        await sleep(1000);
        setPhaseSeconds(seconds);
      }
    }

    setPhase("idle");
    setPhaseSeconds(0);
    manualPausedRef.current = false;
    setIsManuallyPaused(false);
    setIsRecording(false);
  };

  const handleStart = () => {
    if (!isAnswer) {
      void handleQuestionStart();
      return;
    }

    sessionActiveRef.current = true;
    manualPausedRef.current = false;
    setIsManuallyPaused(false);
    answerClipCountRef.current = 0;
    setAnswerClipCount(0);
    setIsRecording(true);
    void runAnswerRecordingCycle();
  };

  const handlePauseToggle = () => {
    const nextPaused = !manualPausedRef.current;
    manualPausedRef.current = nextPaused;
    setIsManuallyPaused(nextPaused);

    if (nextPaused && phase === "recording") {
      cameraRef.current?.stopRecording();
    }
  };

  const handleStop = () => {
    if (isAnswer) {
      sessionActiveRef.current = false;
      manualPausedRef.current = false;
      setIsManuallyPaused(false);
    }
    cameraRef.current?.stopRecording();
  };

  const handleDone = () => {
    navigation.navigate("VivaStudentRounds", {
      assessmentId,
      studentId,
    });
  };

  const handleNextQuestion = () => {
    navigation.replace("VivaRecording", {
      assessmentId,
      studentId,
      roundId: Date.now().toString(),
      speaker: "question",
    });
  };

  const answerRecordingCompleted =
    isAnswer && !isRecording && answerClipCount > 0;

  const handleBackToStudent = () => {
    navigation.navigate("VivaStudentRounds", {
      assessmentId,
      studentId,
    });
  };

  return (
    <Screen>
      <Text style={styles.title}>
        {isAnswer ? "Record Student Answer" : "Record Accessor Question"}
      </Text>

      <Text style={styles.subtitle}>
        {isAnswer
          ? `Back camera - records ${ANSWER_CHUNK_DURATION_SECONDS}-second answer clips with ${ANSWER_PAUSE_DURATION_SECONDS}-second pauses.`
          : "Front camera - ask the student your question."}
      </Text>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={isAnswer ? "back" : "front"}
        mode="video"
      />

      {isAnswer && isRecording && phase === "recording" && (
        <Text style={styles.status}>
          Recording answer clip {answerClipCount + 1}: {phaseSeconds}s /{" "}
          {ANSWER_CHUNK_DURATION_SECONDS}s
        </Text>
      )}

      {isAnswer && isRecording && phase === "uploading" && (
        <Text style={styles.status}>Saving answer clip {answerClipCount + 1}...</Text>
      )}

      {isAnswer && isRecording && phase === "paused" && (
        <Text style={styles.pauseText}>
          Paused before next answer clip: {phaseSeconds}s /{" "}
          {ANSWER_PAUSE_DURATION_SECONDS}s
        </Text>
      )}

      {isAnswer && isRecording && phase === "manualPaused" && (
        <Text style={styles.pauseText}>
          Recording paused. Tap Resume to continue.
        </Text>
      )}

      {isAnswer && !isRecording && answerClipCount > 0 && (
        <Text style={styles.savedText}>
          {answerClipCount} answer clip{answerClipCount === 1 ? "" : "s"} saved.
        </Text>
      )}

      {answerRecordingCompleted ? (
        <View style={styles.postRecordingActions}>
          <View style={styles.actionButton}>
            <AppButton
              title="Go Back"
              variant="secondary"
              onPress={handleDone}
            />
          </View>

          <View style={styles.actionButton}>
            <AppButton
              title="Next Question"
              onPress={handleNextQuestion}
            />
          </View>
        </View>
      ) : isRecording && isAnswer ? (
        <View style={styles.recordingActions}>
          <View style={styles.actionButton}>
            <AppButton
              title={isManuallyPaused ? "Resume" : "Pause"}
              variant="secondary"
              disabled={phase === "uploading"}
              onPress={handlePauseToggle}
            />
          </View>

          <View style={styles.actionButton}>
            <AppButton
              title="Stop"
              variant="danger"
              onPress={handleStop}
            />
          </View>
        </View>
      ) : isRecording ? (
        <AppButton
          title="Stop"
          variant="danger"
          onPress={handleStop}
        />
      ) : (
        <View style={styles.postRecordingActions}>
          <View style={styles.actionButton}>
            <AppButton
              title="Back"
              variant="secondary"
              onPress={handleBackToStudent}
            />
          </View>

          <View style={styles.actionButton}>
            <AppButton title="Start Recording" onPress={handleStart} />
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },

  camera: {
    height: 450,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },

  status: {
    textAlign: "center",
    color: Colors.error,
    fontWeight: "700",
    fontSize: Typography.body,
    marginBottom: Spacing.md,
  },

  pauseText: {
    textAlign: "center",
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: Typography.body,
    marginBottom: Spacing.md,
  },

  savedText: {
    textAlign: "center",
    color: "#16A34A",
    fontWeight: "600",
    fontSize: Typography.body,
    marginBottom: Spacing.md,
  },

  recordingActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },

  postRecordingActions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },

  actionButton: {
    flex: 1,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
  },

  permissionTitle: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  permissionText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
});
