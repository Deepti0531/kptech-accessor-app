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
import { submitPracticalEvidence } from "../../services/assessments/assessorSubmissionsApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RouteProps = RouteProp<
  RootStackParamList,
  "PracticalVideoRecorder"
>;

const CHUNK_DURATION_SECONDS = 15;
const PAUSE_DURATION_SECONDS = 15;

type RecordingPhase =
  | "idle"
  | "recording"
  | "uploading"
  | "paused"
  | "manualPaused";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function PracticalVideoRecorderScreen() {
  const cameraRef = useRef<CameraView>(null);
  const sessionActiveRef = useRef(false);
  const manualPausedRef = useRef(false);

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { assessmentId, studentId } = route.params;

  const { addPracticalEvidence } = useAssessment();

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [phase, setPhase] = useState<RecordingPhase>("idle");
  const [isManuallyPaused, setIsManuallyPaused] = useState(false);
  const [chunkCount, setChunkCount] = useState(0);
  const [phaseSeconds, setPhaseSeconds] = useState(0);

  useEffect(() => {
    if (phase !== "recording") return;

    const interval = setInterval(() => {
      setPhaseSeconds((prev) =>
        Math.min(prev + 1, CHUNK_DURATION_SECONDS)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [phase]);

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
            practical assessment evidence video.
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

  const runRecordingCycle = async () => {
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
          maxDuration: CHUNK_DURATION_SECONDS,
        });

        if (result?.uri) {
          setPhase("uploading");
          const saved = await submitPracticalEvidence({
            batchId: Number(assessmentId),
            studentId: Number(studentId),
            evidenceType: "video",
            fileUri: result.uri,
          });
          addPracticalEvidence(studentId, "video", result.uri, String(saved.id));
          setChunkCount((prev) => prev + 1);
        }
      } catch (error) {
        console.error(error);
        Alert.alert(
          "Upload failed",
          "Couldn't save the practical video clip. Check your connection and try again."
        );
        sessionActiveRef.current = false;
      }

      if (!sessionActiveRef.current) break;

      if (manualPausedRef.current) continue;

      setPhase("paused");
      setPhaseSeconds(0);

      for (
        let seconds = 1;
        seconds <= PAUSE_DURATION_SECONDS && sessionActiveRef.current;
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
    sessionActiveRef.current = true;
    manualPausedRef.current = false;
    setIsManuallyPaused(false);
    setChunkCount(0);
    setIsRecording(true);
    void runRecordingCycle();
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
    sessionActiveRef.current = false;
    manualPausedRef.current = false;
    setIsManuallyPaused(false);
    cameraRef.current?.stopRecording();
  };

  return (
    <Screen>
      <Text style={styles.title}>Record Evidence Video</Text>

      <Text style={styles.subtitle}>
        Recording saves {CHUNK_DURATION_SECONDS}-second evidence clips with a{" "}
        {PAUSE_DURATION_SECONDS}-second pause between clips.
      </Text>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="video"
      />

      {isRecording && phase === "recording" && (
        <Text style={styles.status}>
          Recording clip {chunkCount + 1}: {phaseSeconds}s /{" "}
          {CHUNK_DURATION_SECONDS}s
        </Text>
      )}

      {isRecording && phase === "uploading" && (
        <Text style={styles.status}>Saving clip {chunkCount + 1}...</Text>
      )}

      {isRecording && phase === "paused" && (
        <Text style={styles.pauseText}>
          Paused before next clip: {phaseSeconds}s / {PAUSE_DURATION_SECONDS}s
        </Text>
      )}

      {isRecording && phase === "manualPaused" && (
        <Text style={styles.pauseText}>
          Recording paused. Tap Resume to continue.
        </Text>
      )}

      {!isRecording && chunkCount > 0 && (
        <Text style={styles.savedText}>
          {chunkCount} clip{chunkCount === 1 ? "" : "s"} saved.
        </Text>
      )}

      {!isRecording ? (
        <AppButton title="Start Recording" onPress={handleStart} />
      ) : (
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
      )}

      <View style={styles.doneButton}>
        <AppButton
          title="Done"
          disabled={isRecording}
          onPress={() => navigation.goBack()}
        />
      </View>
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
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: Spacing.md,
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

  actionButton: {
    flex: 1,
  },

  doneButton: {
    marginTop: Spacing.md,
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
