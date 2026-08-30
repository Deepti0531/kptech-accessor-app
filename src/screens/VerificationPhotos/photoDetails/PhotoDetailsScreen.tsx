import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../../components/common/Screen";
import AppButton from "../../../components/common/AppButton";

import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useAssessment } from "../../../context/AssessmentContext";
import { deleteCenterVerificationPhoto } from "../../../services/assessments/arrivalVerificationApi";
import { deleteAssessmentDocumentById } from "../../../services/assessments/assessorSubmissionsApi";

import { Colors } from "../../../theme/colors";
import { Spacing } from "../../../theme/spacing";
import { Typography } from "../../../theme/typography";

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type DetailsRouteProp =
  RouteProp<RootStackParamList, "PhotoDetails">;

export default function PhotoDetailsScreen() {
  const navigation =
    useNavigation<NavigationProp>();

  const route =
    useRoute<DetailsRouteProp>();

  const {
    assessment,
    deletePhoto,
  } = useAssessment();
  const [deleting, setDeleting] = useState(false);

  const {
    assessmentId,
    verificationType,
    photoIndex,
  } = route.params;

  const photos = assessment.verification[verificationType].photos;

  const photo = photos[photoIndex];

  if (!photo) {
    navigation.goBack();
    return null;
  }

  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (["arrival", "centre", "infrastructure"].includes(verificationType)) {
        await deleteCenterVerificationPhoto({
          batchId: Number(assessmentId),
          verificationType,
          photoIndex,
        });
      } else if (
        ["attendanceSheet", "evaluationSheet", "assessorDeclaration"].includes(
          verificationType
        )
      ) {
        const documentId = Number(photo.id);
        if (Number.isFinite(documentId)) {
          await deleteAssessmentDocumentById(documentId);
        }
      }
      deletePhoto(
        verificationType,
        photoIndex
      );

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Delete failed",
        "Couldn't delete the verification photo. Check your connection and try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Screen>

      <Text style={styles.title}>
        Photo
      </Text>

      <Image
        source={{ uri: photo.uri }}
        style={styles.image}
      />

      <View style={styles.row}>
        <View style={styles.button}>
          <AppButton
            title="Replace"
            disabled={deleting}
            onPress={() =>
              navigation.replace(
                "CameraCapture",
                {
                  assessmentId,
                  verificationType,
                  photoIndex,
                  studentId: photo.studentId,
                }
              )
            }
          />
        </View>

        <View style={styles.button}>
          <AppButton
            title="Delete"
            loading={deleting}
            onPress={handleDelete}
          />
        </View>
      </View>

      <AppButton
        title="Close"
        onPress={() => navigation.goBack()}
      />

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
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },

  row: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  button: {
    flex: 1,
  },
});
