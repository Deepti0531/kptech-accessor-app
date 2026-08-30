import { ScrollView, StyleSheet, Text } from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import StudentEvidenceSummaryItem from "../../components/practical/StudentEvidenceSummaryItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { useAssignedBatchStudents } from "../../hooks/useAssignedBatchStudents";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "PracticalAssessment">;

export default function PracticalAssessmentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { assessment } = useAssessment();
  const { assessmentId } = route.params;
  const {
    students,
    loading,
    error,
  } = useAssignedBatchStudents(assessmentId);

  const studentIds = new Set(students.map((student) => student.id));
  const records = assessment.practical.records.filter((record) =>
    studentIds.has(record.studentId)
  );
  const attendanceRecords = assessment.attendance.records.filter((record) =>
    studentIds.has(record.studentId)
  );
  const absentStudentIds = new Set(
    attendanceRecords
      .filter((record) => record.status === "Absent")
      .map((record) => record.studentId)
  );
  const requiredStudentIds = students
    .filter((student) => !absentStudentIds.has(student.id))
    .map((student) => student.id);
  const requiredStudentIdSet = new Set(requiredStudentIds);
  const sortedStudents = [...students].sort((a, b) => {
    const aAbsent = absentStudentIds.has(a.id);
    const bAbsent = absentStudentIds.has(b.id);

    if (aAbsent === bAbsent) return 0;
    return aAbsent ? 1 : -1;
  });

  const studentsWithEvidence = records.filter(
    (record) =>
      requiredStudentIdSet.has(record.studentId) && record.evidence.length > 0
  ).length;

  const canContinue =
    students.length > 0 && studentsWithEvidence === requiredStudentIds.length;

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Practical Assessment
        </Text>

        <Text style={styles.subtitle}>
          Upload photo or video evidence of each student's practical work.
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
          sortedStudents.map((student) => {
            const record = records.find(
              (item) => item.studentId === student.id
            );
            const isAbsent = absentStudentIds.has(student.id);

            return (
              <StudentEvidenceSummaryItem
                key={student.id}
                name={student.name}
                rollNumber={student.rollNumber}
                evidenceCount={record?.evidence.length ?? 0}
                disabled={isAbsent}
                disabledReason="Absent - evidence not required"
                onPress={() =>
                  navigation.navigate("PracticalStudentEvidence", {
                    assessmentId,
                    studentId: student.id,
                  })
                }
              />
            );
          })
        )}

        <VerificationProgress
          title="Practical Assessment Progress"
          completed={studentsWithEvidence}
          total={requiredStudentIds.length}
        />

        <AppButton
          title="Continue"
          disabled={!canContinue}
          onPress={() => {
            navigation.navigate("VivaAssessment", {
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
