import { ScrollView, StyleSheet, Text } from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import StudentVivaSummaryItem from "../../components/viva/StudentVivaSummaryItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { useAssignedBatchStudents } from "../../hooks/useAssignedBatchStudents";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "VivaAssessment">;

export default function VivaAssessmentScreen() {
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
  const records = assessment.viva.records.filter((record) =>
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

  const studentsWithCompleteRound = records.filter(
    (record) =>
      requiredStudentIdSet.has(record.studentId) &&
      record.rounds.some(
        (round) => round.questionClip && round.answerClip
      )
  ).length;

  const canContinue =
    students.length > 0 &&
    studentsWithCompleteRound === requiredStudentIds.length;

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Viva Assessment
        </Text>

        <Text style={styles.subtitle}>
          Record each student's question and answer as a Q&A round.
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

            const rounds = record?.rounds ?? [];
            const completeRounds = rounds.filter(
              (round) => round.questionClip && round.answerClip
            ).length;

            return (
              <StudentVivaSummaryItem
                key={student.id}
                name={student.name}
                rollNumber={student.rollNumber}
                completeRounds={completeRounds}
                totalRounds={rounds.length}
                disabled={isAbsent}
                disabledReason="Absent - viva not required"
                onPress={() =>
                  navigation.navigate("VivaStudentRounds", {
                    assessmentId,
                    studentId: student.id,
                  })
                }
              />
            );
          })
        )}

        <VerificationProgress
          title="Viva Assessment Progress"
          completed={studentsWithCompleteRound}
          total={requiredStudentIds.length}
        />

        <AppButton
          title="Continue"
          disabled={!canContinue}
          onPress={() => {
            navigation.navigate("DocumentsUpload", {
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
