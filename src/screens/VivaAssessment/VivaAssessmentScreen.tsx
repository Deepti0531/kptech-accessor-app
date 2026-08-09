import { ScrollView, StyleSheet, Text } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import StudentVivaSummaryItem from "../../components/viva/StudentVivaSummaryItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { useAssessment } from "../../context/AssessmentContext";
import { students } from "../../data/studentsData";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function VivaAssessmentScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { assessment } = useAssessment();

  const studentsWithCompleteRound = assessment.viva.records.filter(
    (record) =>
      record.rounds.some(
        (round) => round.questionClip && round.answerClip
      )
  ).length;

  const canContinue = studentsWithCompleteRound === students.length;

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

        {students.map((student) => {
          const record = assessment.viva.records.find(
            (item) => item.studentId === student.id
          );

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
              onPress={() =>
                navigation.navigate("VivaStudentRounds", {
                  assessmentId: assessment.id,
                  studentId: student.id,
                })
              }
            />
          );
        })}

        <VerificationProgress
          title="Viva Assessment Progress"
          completed={studentsWithCompleteRound}
          total={students.length}
        />

        <AppButton
          title="Continue"
          disabled={!canContinue}
          onPress={() => {
            navigation.navigate("DocumentsUpload", {
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
