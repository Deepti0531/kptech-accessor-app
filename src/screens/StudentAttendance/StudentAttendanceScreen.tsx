import { ScrollView, StyleSheet, Text } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import StudentAttendanceItem from "../../components/attendance/StudentAttendanceItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { students } from "../../data/studentsData";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function StudentAttendanceScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { assessment, markAttendance } = useAssessment();

  const markedCount = assessment.attendance.records.filter(
    (record) => record.status !== "Not Marked"
  ).length;

  const verifiedCount = assessment.attendance.records.filter(
    (record) =>
      record.status === "Present" && record.aadhaarPhoto !== undefined
  ).length;

  const presentCount = assessment.attendance.records.filter(
    (record) => record.status === "Present"
  ).length;

  const allMarked = markedCount === students.length;
  const allPresentVerified = verifiedCount === presentCount;
  const canContinue = allMarked && allPresentVerified;

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

        {students.map((student) => {
          const record = assessment.attendance.records.find(
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
              onMarkPresent={() =>
                markAttendance(student.id, "Present")
              }
              onMarkAbsent={() =>
                markAttendance(student.id, "Absent")
              }
              onVerifyAadhaar={() =>
                navigation.navigate(
                  aadhaarVerified ? "AadhaarDetails" : "AadhaarCapture",
                  {
                    assessmentId: assessment.id,
                    studentId: student.id,
                  }
                )
              }
            />
          );
        })}

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
