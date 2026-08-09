import { ScrollView, StyleSheet, Text } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import StudentEvidenceSummaryItem from "../../components/practical/StudentEvidenceSummaryItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { students } from "../../data/studentsData";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PracticalAssessmentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { assessment } = useAssessment();

  const studentsWithEvidence = assessment.practical.records.filter(
    (record) => record.evidence.length > 0
  ).length;

  const canContinue = studentsWithEvidence === students.length;

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

        {students.map((student) => {
          const record = assessment.practical.records.find(
            (item) => item.studentId === student.id
          );

          return (
            <StudentEvidenceSummaryItem
              key={student.id}
              name={student.name}
              rollNumber={student.rollNumber}
              evidenceCount={record?.evidence.length ?? 0}
              onPress={() =>
                navigation.navigate("PracticalStudentEvidence", {
                  assessmentId: assessment.id,
                  studentId: student.id,
                })
              }
            />
          );
        })}

        <VerificationProgress
          title="Practical Assessment Progress"
          completed={studentsWithEvidence}
          total={students.length}
        />

        <AppButton
          title="Continue"
          disabled={!canContinue}
          onPress={() => {
            navigation.navigate("VivaAssessment", {
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
