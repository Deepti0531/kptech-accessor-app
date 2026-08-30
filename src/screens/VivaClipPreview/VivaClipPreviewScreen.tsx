import { Alert, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";

import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAssessment } from "../../context/AssessmentContext";
import { submitVivaEvidence } from "../../services/assessments/assessorSubmissionsApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PreviewRouteProp = RouteProp<
  RootStackParamList,
  "VivaClipPreview"
>;

export default function VivaClipPreviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PreviewRouteProp>();

  const { addVivaClip } = useAssessment();
  const [submitting, setSubmitting] = useState(false);

  const {
    assessmentId,
    studentId,
    roundId,
    speaker,
    videoUri,
  } = route.params;

  const player = useVideoPlayer(videoUri);

  const handleDelete = () => {
    navigation.goBack();
    navigation.goBack();
  };

  const handleUseRecording = async () => {
    setSubmitting(true);
    try {
      const saved = await submitVivaEvidence({
        batchId: Number(assessmentId),
        studentId: Number(studentId),
        roundId,
        speaker,
        videoUri,
      });
      addVivaClip(studentId, roundId, speaker, videoUri, String(saved.id));

      if (speaker === "question") {
        // Move straight on to recording the student's answer.
        navigation.replace("VivaRecording", {
          assessmentId,
          studentId,
          roundId,
          speaker: "answer",
        });
      } else {
        // Back to Camera
        navigation.goBack();

        // Back to Viva Rounds
        navigation.goBack();
      }
    } catch {
      Alert.alert(
        "Upload failed",
        "Couldn't save the viva recording. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>
        {speaker === "question" ? "Review Question" : "Review Answer"}
      </Text>

      <VideoView
        player={player}
        style={styles.video}
        nativeControls
      />

      <View style={styles.actions}>
        <View style={styles.buttonContainer}>
          <AppButton
            title="Delete"
            disabled={submitting}
            onPress={handleDelete}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Retake"
            disabled={submitting}
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Upload"
            loading={submitting}
            onPress={handleUseRecording}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },

  video: {
    width: "100%",
    height: 450,
    borderRadius: 20,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.black,
  },

  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  buttonContainer: {
    flex: 1,
  },
});
