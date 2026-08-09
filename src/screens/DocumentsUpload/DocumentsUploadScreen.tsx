import { useAssessment } from "../../context/AssessmentContext";
import { ScrollView, StyleSheet, Text } from "react-native";

import Screen from "../../components/common/Screen";
import VerificationItem from "../../components/verification/VerificationItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { verificationTypeConfig } from "../../data/verificationTypeConfig";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function DocumentsUploadScreen() {
  const { assessment } = useAssessment();
  const navigation = useNavigation<NavigationProp>();

  const attendanceSheetUploaded =
    assessment.verification.attendanceSheet.photos.filter(
      (photo) => photo !== undefined
    ).length;

  const evaluationSheetUploaded =
    assessment.verification.evaluationSheet.photos.filter(
      (photo) => photo !== undefined
    ).length;

  const assessorDeclarationUploaded =
    assessment.verification.assessorDeclaration.photos.filter(
      (photo) => photo !== undefined
    ).length;

  const attendanceSheetDone = attendanceSheetUploaded === 1;
  const evaluationSheetDone = evaluationSheetUploaded === 1;
  const assessorDeclarationDone = assessorDeclarationUploaded === 1;

  const completedCount =
    Number(attendanceSheetDone) +
    Number(evaluationSheetDone) +
    Number(assessorDeclarationDone);

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Documents Upload
        </Text>

        <Text style={styles.subtitle}>
          Capture all required documents in the prescribed format before
          final submission.
        </Text>

        <VerificationItem
          title={verificationTypeConfig.attendanceSheet.title}
          subtitle={verificationTypeConfig.attendanceSheet.subtitle}
          icon="clipboard-outline"
          completed={attendanceSheetDone}
          completedAt={
            assessment.verification.attendanceSheet.lastUpdated
              ? new Date(
                  assessment.verification.attendanceSheet.lastUpdated
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined
          }
          onPress={() =>
            navigation.navigate("VerificationPhotos", {
              assessmentId: assessment.id,
              verificationType: "attendanceSheet",
            })
          }
        />

        <VerificationItem
          title={verificationTypeConfig.evaluationSheet.title}
          subtitle={verificationTypeConfig.evaluationSheet.subtitle}
          icon="document-text-outline"
          completed={evaluationSheetDone}
          completedAt={
            assessment.verification.evaluationSheet.lastUpdated
              ? new Date(
                  assessment.verification.evaluationSheet.lastUpdated
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined
          }
          onPress={() =>
            navigation.navigate("VerificationPhotos", {
              assessmentId: assessment.id,
              verificationType: "evaluationSheet",
            })
          }
        />

        <VerificationItem
          title={verificationTypeConfig.assessorDeclaration.title}
          subtitle={verificationTypeConfig.assessorDeclaration.subtitle}
          icon="create-outline"
          completed={assessorDeclarationDone}
          completedAt={
            assessment.verification.assessorDeclaration.lastUpdated
              ? new Date(
                  assessment.verification.assessorDeclaration.lastUpdated
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined
          }
          onPress={() =>
            navigation.navigate("VerificationPhotos", {
              assessmentId: assessment.id,
              verificationType: "assessorDeclaration",
            })
          }
        />

        <VerificationProgress
          title="Documents Progress"
          completed={completedCount}
          total={3}
        />

        <AppButton
          title="Continue"
          disabled={completedCount !== 3}
          onPress={() => {
            navigation.navigate("FinalSubmission", {
              assessmentId: assessment.id,
            });
          }}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  container: {
    paddingBottom: 40,
    gap: Spacing.lg,
  },

  title: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  subtitle: {
    marginBottom: Spacing.lg,
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
});
