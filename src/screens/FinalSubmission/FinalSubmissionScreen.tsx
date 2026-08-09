import { Alert, ScrollView, StyleSheet, Text } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import ChecklistItem from "../../components/submission/ChecklistItem";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { students } from "../../data/studentsData";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FinalSubmissionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { assessment, setAssessment } = useAssessment();

  const verificationComplete =
    assessment.verification.arrival.photos.filter((p) => p).length === 1 &&
    assessment.verification.centre.photos.filter((p) => p).length === 3 &&
    assessment.verification.infrastructure.photos.filter((p) => p).length ===
      4;

  const attendanceComplete = assessment.attendance.records.every(
    (record) =>
      record.status !== "Not Marked" &&
      (record.status !== "Present" || record.aadhaarPhoto !== undefined)
  );

  const practicalComplete = assessment.practical.records.every(
    (record) => record.evidence.length > 0
  );

  const vivaComplete = assessment.viva.records.every((record) =>
    record.rounds.some((round) => round.questionClip && round.answerClip)
  );

  const documentsComplete =
    assessment.verification.attendanceSheet.photos.filter((p) => p)
      .length === 1 &&
    assessment.verification.evaluationSheet.photos.filter((p) => p)
      .length === 1 &&
    assessment.verification.assessorDeclaration.photos.filter((p) => p)
      .length === 1;

  const allComplete =
    verificationComplete &&
    attendanceComplete &&
    practicalComplete &&
    vivaComplete &&
    documentsComplete;

  const handleSubmit = () => {
    Alert.alert(
      "Submit Assessment?",
      "This action cannot be undone. Make sure all evidence and documents are correct before submitting.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          style: "destructive",
          onPress: () => {
            setAssessment((prev) => ({
              ...prev,
              status: "Completed",
            }));

            navigation.reset({
              index: 0,
              routes: [{ name: "Assessments" }],
            });
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Verification and Submission
        </Text>

        <Text style={styles.subtitle}>
          Verify that all photographs, videos, attendance records, Aadhaar
          verification records, and required documents have been uploaded
          successfully before submitting.
        </Text>

        <ChecklistItem
          title="Center Verification"
          subtitle="Arrival, centre and infrastructure photographs."
          complete={verificationComplete}
          onPress={() =>
            navigation.navigate("CenterVerification", {
              assessmentId: assessment.id,
            })
          }
        />

        <ChecklistItem
          title="Student Attendance & Aadhaar"
          subtitle="Attendance marked and Aadhaar verified for every present student."
          complete={attendanceComplete}
          onPress={() =>
            navigation.navigate("StudentAttendance", {
              assessmentId: assessment.id,
            })
          }
        />

        <ChecklistItem
          title="Practical Assessment Evidence"
          subtitle="Photo or video evidence for every student."
          complete={practicalComplete}
          onPress={() =>
            navigation.navigate("PracticalAssessment", {
              assessmentId: assessment.id,
            })
          }
        />

        <ChecklistItem
          title="Viva Assessment"
          subtitle="Question and answer recordings for every student."
          complete={vivaComplete}
          onPress={() =>
            navigation.navigate("VivaAssessment", {
              assessmentId: assessment.id,
            })
          }
        />

        <ChecklistItem
          title="Documents Upload"
          subtitle="Attendance sheet, evaluation sheet and assessor declaration."
          complete={documentsComplete}
          onPress={() =>
            navigation.navigate("DocumentsUpload", {
              assessmentId: assessment.id,
            })
          }
        />

        <AppButton
          title="Submit Assessment"
          disabled={!allComplete}
          onPress={handleSubmit}
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
