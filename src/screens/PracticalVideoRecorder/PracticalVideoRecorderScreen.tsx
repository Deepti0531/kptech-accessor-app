import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RouteProps = RouteProp<
  RootStackParamList,
  "PracticalVideoRecorder"
>;

const CHUNK_DURATION_SECONDS = 30;

export default function PracticalVideoRecorderScreen() {
  const cameraRef = useRef<CameraView>(null);
  const sessionActiveRef = useRef(false);

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { studentId } = route.params;

  const { addPracticalEvidence } = useAssessment();

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [chunkCount, setChunkCount] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

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

  const recordNextChunk = async () => {
    setElapsedSeconds(0);

    try {
      const result = await cameraRef.current?.recordAsync({
        maxDuration: CHUNK_DURATION_SECONDS,
      });

      if (result?.uri) {
        addPracticalEvidence(studentId, "video", result.uri);
        setChunkCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      sessionActiveRef.current = false;
    }

    if (sessionActiveRef.current) {
      recordNextChunk();
    } else {
      setIsRecording(false);
    }
  };

  const handleStart = () => {
    sessionActiveRef.current = true;
    setChunkCount(0);
    setIsRecording(true);
    recordNextChunk();
  };

  const handleStop = () => {
    sessionActiveRef.current = false;
    cameraRef.current?.stopRecording();
  };

  return (
    <Screen>
      <Text style={styles.title}>Record Evidence Video</Text>

      <Text style={styles.subtitle}>
        Recording saves automatically every {CHUNK_DURATION_SECONDS} seconds
        as a separate evidence clip, so no single long recording is held in
        memory.
      </Text>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="video"
      />

      {isRecording && (
        <Text style={styles.status}>
          ● Recording clip {chunkCount + 1} • {elapsedSeconds}s /{" "}
          {CHUNK_DURATION_SECONDS}s
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
        <AppButton title="Stop Recording" onPress={handleStop} />
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

  savedText: {
    textAlign: "center",
    color: "#16A34A",
    fontWeight: "600",
    fontSize: Typography.body,
    marginBottom: Spacing.md,
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
