import { Alert, ScrollView, StyleSheet, Text } from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import ChecklistItem from "../../components/submission/ChecklistItem";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { useAssignedBatchStudents } from "../../hooks/useAssignedBatchStudents";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "FinalSubmission">;

export default function FinalSubmissionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { assessment, setAssessment } = useAssessment();
  const { assessmentId } = route.params;
  const {
    students,
    loading: studentsLoading,
  } = useAssignedBatchStudents(assessmentId);
  const studentIds = new Set(students.map((student) => student.id));
  const attendanceRecords = assessment.attendance.records.filter((record) =>
    studentIds.has(record.studentId)
  );
  const absentStudentIds = new Set(
    attendanceRecords
      .filter((record) => record.status === "Absent")
      .map((record) => record.studentId)
  );
  const presentStudents = students.filter(
    (student) => !absentStudentIds.has(student.id)
  );
  const presentStudentIds = new Set(
    presentStudents.map((student) => student.id)
  );
  const practicalRecords = assessment.practical.records.filter((record) =>
    presentStudentIds.has(record.studentId)
  );
  const vivaRecords = assessment.viva.records.filter((record) =>
    presentStudentIds.has(record.studentId)
  );

  const verificationComplete =
    assessment.verification.arrival.photos.filter((p) => p).length === 1 &&
    assessment.verification.centre.photos.filter((p) => p).length === 3 &&
    assessment.verification.infrastructure.photos.filter((p) => p).length ===
      4;

  const attendanceComplete =
    students.length > 0 &&
    attendanceRecords.length === students.length &&
    attendanceRecords.every(
      (record) =>
        record.status !== "Not Marked" &&
        (record.status !== "Present" || record.aadhaarPhoto !== undefined)
    );

  const practicalComplete =
    students.length > 0 &&
    practicalRecords.length === presentStudents.length &&
    practicalRecords.every((record) => record.evidence.length > 0);

  const vivaComplete =
    students.length > 0 &&
    vivaRecords.length === presentStudents.length &&
    vivaRecords.every((record) =>
      record.rounds.some((round) => round.questionClip && round.answerClip)
    );

  const documentsComplete =
    assessment.verification.attendanceSheet.photos.filter((p) => p)
      .length >= 1 &&
    presentStudents.every((student) =>
      assessment.verification.evaluationSheet.photos.some(
        (photo) => photo?.studentId === student.id
      )
    ) &&
    assessment.verification.assessorDeclaration.photos.filter((p) => p)
      .length >= 1;

  const allComplete =
    verificationComplete &&
    attendanceComplete &&
    practicalComplete &&
    vivaComplete &&
    documentsComplete &&
    !studentsLoading;

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
              assessmentId,
            })
          }
        />

        <ChecklistItem
          title="Student Attendance & Aadhaar"
          subtitle="Attendance marked and Aadhaar verified for every present student."
          complete={attendanceComplete}
          onPress={() =>
            navigation.navigate("StudentAttendance", {
              assessmentId,
            })
          }
        />

        <ChecklistItem
          title="Practical Assessment Evidence"
          subtitle="Photo or video evidence for every present student."
          complete={practicalComplete}
          onPress={() =>
            navigation.navigate("PracticalAssessment", {
              assessmentId,
            })
          }
        />

        <ChecklistItem
          title="Viva Assessment"
          subtitle="Question and answer recordings for every present student."
          complete={vivaComplete}
          onPress={() =>
            navigation.navigate("VivaAssessment", {
              assessmentId,
            })
          }
        />

        <ChecklistItem
          title="Documents Upload"
          subtitle="Attendance sheets, student evaluation sheets and assessor declarations."
          complete={documentsComplete}
          onPress={() =>
            navigation.navigate("DocumentsUpload", {
              assessmentId,
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
