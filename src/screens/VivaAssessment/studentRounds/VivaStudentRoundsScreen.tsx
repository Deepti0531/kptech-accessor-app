import { ScrollView, StyleSheet, Text } from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../../components/common/Screen";
import AppButton from "../../../components/common/AppButton";
import VivaRoundCard from "../../../components/viva/VivaRoundCard";

import { useAssessment } from "../../../context/AssessmentContext";
import { students } from "../../../data/studentsData";

import { RootStackParamList } from "../../../navigation/AppNavigator";

import { Colors } from "../../../theme/colors";
import { Spacing } from "../../../theme/spacing";
import { Typography } from "../../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RouteProps = RouteProp<
  RootStackParamList,
  "VivaStudentRounds"
>;

export default function VivaStudentRoundsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { assessment } = useAssessment();
  const { assessmentId, studentId } = route.params;

  const student = students.find((item) => item.id === studentId);

  const record = assessment.viva.records.find(
    (item) => item.studentId === studentId
  );

  const rounds = record?.rounds ?? [];

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          {student?.name ?? "Viva Assessment"}
        </Text>

        <Text style={styles.subtitle}>
          {student?.rollNumber} • Record the accessor's question, then
          the student's answer, for each round.
        </Text>

        {rounds.length === 0 ? (
          <Text style={styles.emptyText}>
            No questions recorded yet.
          </Text>
        ) : (
          rounds.map((round, index) => (
            <VivaRoundCard
              key={round.id}
              roundNumber={index + 1}
              hasQuestionClip={!!round.questionClip}
              hasAnswerClip={!!round.answerClip}
              onRecordQuestion={() =>
                navigation.navigate("VivaRecording", {
                  assessmentId,
                  studentId,
                  roundId: round.id,
                  speaker: "question",
                })
              }
              onViewQuestion={() =>
                navigation.navigate("VivaClipViewer", {
                  assessmentId,
                  studentId,
                  roundId: round.id,
                  speaker: "question",
                })
              }
              onRecordAnswer={() =>
                navigation.navigate("VivaRecording", {
                  assessmentId,
                  studentId,
                  roundId: round.id,
                  speaker: "answer",
                })
              }
              onViewAnswer={() =>
                navigation.navigate("VivaClipViewer", {
                  assessmentId,
                  studentId,
                  roundId: round.id,
                  speaker: "answer",
                })
              }
            />
          ))
        )}

        <AppButton
          title="Start New Question"
          onPress={() => {
            const roundId = Date.now().toString();

            navigation.navigate("VivaRecording", {
              assessmentId,
              studentId,
              roundId,
              speaker: "question",
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
