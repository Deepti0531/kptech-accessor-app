import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAssessment } from "../../context/AssessmentContext";
import {
  submitArrivalVerification,
  submitCenterVerificationPhoto,
} from "../../services/assessments/arrivalVerificationApi";
import {
  deleteAssessmentDocumentById,
  submitAssessmentDocument,
} from "../../services/assessments/assessorSubmissionsApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PreviewRouteProp = RouteProp<RootStackParamList, "PhotoPreview">;

const DOCUMENT_TYPES = [
  "attendanceSheet",
  "evaluationSheet",
  "assessorDeclaration",
];

export default function PhotoPreviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PreviewRouteProp>();

  const { addPhoto, assessment } = useAssessment();
  const [submitting, setSubmitting] = useState(false);

  const {
    assessmentId,
    verificationType,
    photoIndex,
    photoUri,
    latitude,
    longitude,
    accuracy,
    studentId,
  } = route.params;
  const previousPhoto =
    assessment.verification[verificationType].photos[photoIndex];

  const handleDelete = () => {
    navigation.goBack();
    navigation.goBack();
  };

  const handleUsePhoto = async () => {
    setSubmitting(true);
    try {
      if (verificationType === "arrival") {
        await submitArrivalVerification({
          batchId: Number(assessmentId),
          photoUri,
          latitude,
          longitude,
          accuracy,
        });
      } else if (["centre", "infrastructure"].includes(verificationType)) {
        await submitCenterVerificationPhoto({
          batchId: Number(assessmentId),
          photoUri,
          verificationType,
          photoIndex,
        });
      } else if (DOCUMENT_TYPES.includes(verificationType)) {
        const saved = await submitAssessmentDocument({
          batchId: Number(assessmentId),
          documentType: verificationType,
          photoUri,
          studentId: studentId ? Number(studentId) : undefined,
        });
        addPhoto(verificationType, photoIndex, photoUri, String(saved.id), studentId);

        const previousDocumentId = Number(previousPhoto?.id);
        if (Number.isFinite(previousDocumentId)) {
          await deleteAssessmentDocumentById(previousDocumentId);
        }

        navigation.goBack();
        navigation.goBack();
        return;
      }

      addPhoto(verificationType, photoIndex, photoUri);
      navigation.goBack();
      navigation.goBack();
    } catch {
      Alert.alert(
        "Upload failed",
        "Couldn't save the verification photo. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Photo Preview</Text>

      <Image source={{ uri: photoUri }} style={styles.image} />

      {verificationType === "arrival" && (
        <Text style={styles.locationNote}>
          {latitude !== undefined && longitude !== undefined
            ? `Location captured: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
            : "Location unavailable - photo will still be saved."}
        </Text>
      )}

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
            onPress={handleUsePhoto}
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

  image: {
    width: "100%",
    height: 450,
    borderRadius: 20,
    marginBottom: Spacing.xl,
  },

  locationNote: {
    marginTop: -Spacing.lg,
    marginBottom: Spacing.lg,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },

  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  buttonContainer: {
    flex: 1,
  },
});
