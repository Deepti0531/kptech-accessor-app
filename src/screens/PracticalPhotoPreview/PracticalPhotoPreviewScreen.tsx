import { Alert, StyleSheet, Text, View, Image } from "react-native";
import { useState } from "react";
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
import { submitPracticalEvidence } from "../../services/assessments/assessorSubmissionsApi";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PreviewRouteProp = RouteProp<
  RootStackParamList,
  "PracticalPhotoPreview"
>;

export default function PracticalPhotoPreviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PreviewRouteProp>();

  const { addPracticalEvidence } = useAssessment();
  const [submitting, setSubmitting] = useState(false);

  const { assessmentId, studentId, photoUri } = route.params;

  const handleDelete = () => {
    navigation.goBack();
    navigation.goBack();
  };

  const handleUsePhoto = async () => {
    setSubmitting(true);
    try {
      const saved = await submitPracticalEvidence({
        batchId: Number(assessmentId),
        studentId: Number(studentId),
        evidenceType: "photo",
        fileUri: photoUri,
      });
      addPracticalEvidence(studentId, "photo", photoUri, String(saved.id));

      // Back to Camera
      navigation.goBack();

      // Back to Student Evidence
      navigation.goBack();
    } catch {
      Alert.alert(
        "Upload failed",
        "Couldn't save the practical photo. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>
        Evidence Photo Preview
      </Text>

      <Image
        source={{ uri: photoUri }}
        style={styles.image}
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

  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  buttonContainer: {
    flex: 1,
  },
});
