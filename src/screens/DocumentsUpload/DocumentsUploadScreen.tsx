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

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAssignedBatchStudents } from "../../hooks/useAssignedBatchStudents";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "DocumentsUpload">;

export default function DocumentsUploadScreen() {
  const { assessment } = useAssessment();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { assessmentId } = route.params;
  const { students } = useAssignedBatchStudents(assessmentId);
  const absentStudentIds = new Set(
    assessment.attendance.records
      .filter((record) => record.status === "Absent")
      .map((record) => record.studentId)
  );
  const presentStudents = students.filter(
    (student) => !absentStudentIds.has(student.id)
  );

  const attendanceSheetUploaded =
    assessment.verification.attendanceSheet.photos.filter(
      (photo) => photo !== undefined
    ).length;

  const evaluationSheetPhotos = assessment.verification.evaluationSheet.photos;

  const assessorDeclarationUploaded =
    assessment.verification.assessorDeclaration.photos.filter(
      (photo) => photo !== undefined
    ).length;

  const attendanceSheetDone = attendanceSheetUploaded >= 1;
  const evaluationSheetDoneCount = presentStudents.filter((student) =>
    evaluationSheetPhotos.some((photo) => photo?.studentId === student.id)
  ).length;
  const assessorDeclarationDone = assessorDeclarationUploaded >= 1;

  const completedCount =
    Number(attendanceSheetDone) +
    evaluationSheetDoneCount +
    Number(assessorDeclarationDone);
  const totalRequired = 2 + presentStudents.length;

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
              assessmentId,
              verificationType: "attendanceSheet",
            })
          }
        />

        <VerificationItem
          title={verificationTypeConfig.evaluationSheet.title}
          subtitle={`${evaluationSheetDoneCount} / ${presentStudents.length} uploaded`}
          icon="document-text-outline"
          completed={
            presentStudents.length > 0 &&
            evaluationSheetDoneCount === presentStudents.length
          }
          onPress={() =>
            navigation.navigate("EvaluationSheets", {
              assessmentId,
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
              assessmentId,
              verificationType: "assessorDeclaration",
            })
          }
        />

        <VerificationProgress
          title="Documents Progress"
          completed={completedCount}
          total={totalRequired}
        />

        <AppButton
          title="Continue"
          disabled={completedCount !== totalRequired}
          onPress={() => {
            navigation.navigate("FinalSubmission", {
              assessmentId,
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
