import React, { useState } from "react";
import { Alert, StyleSheet, Text, View, Image } from "react-native";
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
import { submitArrivalVerification } from "../../services/assessments/arrivalVerificationApi";

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type PreviewRouteProp =
  RouteProp<RootStackParamList, "PhotoPreview">;

export default function PhotoPreviewScreen() {
  const navigation =
    useNavigation<NavigationProp>();

  const route =
    useRoute<PreviewRouteProp>();

  const { addPhoto } =
    useAssessment();

  const [submitting, setSubmitting] = useState(false);

  const {
    assessmentId,
    verificationType,
    photoIndex,
    photoUri,
    latitude,
    longitude,
    accuracy,
  } = route.params;

  const handleUsePhoto = async () => {
    if (verificationType !== "arrival") {
      // Every other verification type is still local-only mock state
      // (Phase 2) — unchanged behavior.
      addPhoto(verificationType, photoIndex, photoUri);
      navigation.goBack(); // Back to Camera
      navigation.goBack(); // Back to Verification Photos
      return;
    }

    setSubmitting(true);
    try {
      await submitArrivalVerification({
        batchId: Number(assessmentId),
        photoUri,
        latitude,
        longitude,
        accuracy,
      });
      addPhoto(verificationType, photoIndex, photoUri);
      navigation.goBack(); // Back to Camera
      navigation.goBack(); // Back to Verification Photos
    } catch (error) {
      Alert.alert(
        "Upload failed",
        "Couldn't save the arrival photo. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>
        Photo Preview
      </Text>

      <Image
        source={{ uri: photoUri }}
        style={styles.image}
      />

      {verificationType === "arrival" && (
        <Text style={styles.locationNote}>
          {latitude !== undefined && longitude !== undefined
            ? `Location captured: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
            : "Location unavailable — photo will still be saved."}
        </Text>
      )}

      <View style={styles.actions}>
        <View style={styles.buttonContainer}>
          <AppButton
            title="Retake"
            disabled={submitting}
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Use Photo"
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
