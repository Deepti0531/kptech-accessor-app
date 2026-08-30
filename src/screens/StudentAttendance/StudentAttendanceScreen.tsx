import { Alert, ScrollView, StyleSheet, Text } from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import StudentAttendanceItem from "../../components/attendance/StudentAttendanceItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { useAssignedBatchStudents } from "../../hooks/useAssignedBatchStudents";
import { markStudentAttendance } from "../../services/assessments/assessorSubmissionsApi";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "StudentAttendance">;

export default function StudentAttendanceScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { assessment, markAttendance } = useAssessment();
  const { assessmentId } = route.params;
  const {
    students,
    loading,
    error,
  } = useAssignedBatchStudents(assessmentId);

  const studentIds = new Set(students.map((student) => student.id));
  const records = assessment.attendance.records.filter((record) =>
    studentIds.has(record.studentId)
  );

  const markedCount = records.filter(
    (record) => record.status !== "Not Marked"
  ).length;

  const verifiedCount = records.filter(
    (record) =>
      record.status === "Present" && record.aadhaarPhoto !== undefined
  ).length;

  const presentCount = records.filter(
    (record) => record.status === "Present"
  ).length;

  const allMarked = students.length > 0 && markedCount === students.length;
  const allPresentVerified = verifiedCount === presentCount;
  const canContinue = allMarked && allPresentVerified;

  const handleMarkAttendance = async (
    studentId: string,
    status: "Present" | "Absent"
  ) => {
    try {
      await markStudentAttendance({
        batchId: Number(assessmentId),
        studentId: Number(studentId),
        status,
      });
      markAttendance(studentId, status);
    } catch {
      Alert.alert(
        "Could not save attendance",
        "Check your connection and try again."
      );
    }
  };

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Student Attendance
        </Text>

        <Text style={styles.subtitle}>
          Mark attendance and verify Aadhaar for every present student.
        </Text>

        {loading ? (
          <Text style={styles.emptyText}>Loading students...</Text>
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : students.length === 0 ? (
          <Text style={styles.emptyText}>
            No students found for this batch.
          </Text>
        ) : (
          students.map((student) => {
            const record = records.find(
              (item) => item.studentId === student.id
            );

            const status = record?.status ?? "Not Marked";
            const aadhaarVerified = record?.aadhaarPhoto !== undefined;

            return (
              <StudentAttendanceItem
                key={student.id}
                name={student.name}
                rollNumber={student.rollNumber}
                aadhaarNumber={student.aadhaarNumber}
                status={status}
                aadhaarVerified={aadhaarVerified}
                onMarkPresent={() => {
                  void handleMarkAttendance(student.id, "Present");
                }}
                onMarkAbsent={() => {
                  void handleMarkAttendance(student.id, "Absent");
                }}
                onVerifyAadhaar={() =>
                  navigation.navigate(
                    aadhaarVerified ? "AadhaarDetails" : "AadhaarCapture",
                    {
                      assessmentId,
                      studentId: student.id,
                    }
                  )
                }
              />
            );
          })
        )}

        <VerificationProgress
          title="Attendance Progress"
          completed={markedCount}
          total={students.length}
        />

        <AppButton
          title="Continue"
          disabled={!canContinue}
          onPress={() => {
            navigation.navigate("PracticalAssessment", {
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

  emptyText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginVertical: Spacing.xl,
  },
});
