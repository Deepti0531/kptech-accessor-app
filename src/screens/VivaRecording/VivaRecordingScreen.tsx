import { useRef, useState } from "react";
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RouteProps = RouteProp<RootStackParamList, "VivaRecording">;

const MAX_LEG_DURATION_SECONDS = 300;

export default function VivaRecordingScreen() {
  const cameraRef = useRef<CameraView>(null);

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { assessmentId, studentId, roundId, speaker } = route.params;

  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] =
    useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);

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
            the viva {speaker === "question" ? "question" : "answer"}.
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

  const handleStart = async () => {
    if (!cameraRef.current) return;

    setIsRecording(true);

    try {
      const result = await cameraRef.current.recordAsync({
        maxDuration: MAX_LEG_DURATION_SECONDS,
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

  const handleStop = () => {
    cameraRef.current?.stopRecording();
  };

  return (
    <Screen>
      <Text style={styles.title}>
        {speaker === "question"
          ? "Record Accessor Question"
          : "Record Student Answer"}
      </Text>

      <Text style={styles.subtitle}>
        {speaker === "question"
          ? "Front camera — ask the student your question."
          : "Back camera — point at the student for their answer."}
      </Text>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={speaker === "question" ? "front" : "back"}
        mode="video"
      />

      {isRecording ? (
        <AppButton title="Stop Recording" onPress={handleStop} />
      ) : (
        <AppButton title="Start Recording" onPress={handleStart} />
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
