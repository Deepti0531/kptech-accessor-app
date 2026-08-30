import { ScrollView, StyleSheet, Text, View } from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../../components/common/Screen";
import AppButton from "../../../components/common/AppButton";
import EvidenceThumbnail from "../../../components/practical/EvidenceThumbnail";

import { useAssessment } from "../../../context/AssessmentContext";
import { useAssignedBatchStudents } from "../../../hooks/useAssignedBatchStudents";

import { RootStackParamList } from "../../../navigation/AppNavigator";

import { Colors } from "../../../theme/colors";
import { Spacing } from "../../../theme/spacing";
import { Typography } from "../../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RouteProps = RouteProp<
  RootStackParamList,
  "PracticalStudentEvidence"
>;

export default function PracticalStudentEvidenceScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { assessment } = useAssessment();
  const { assessmentId, studentId } = route.params;
  const {
    students,
    loading,
  } = useAssignedBatchStudents(assessmentId);

  const student = students.find((item) => item.id === studentId);

  const record = assessment.practical.records.find(
    (item) => item.studentId === studentId
  );
  const attendanceRecord = assessment.attendance.records.find(
    (item) => item.studentId === studentId
  );
  const isAbsent = attendanceRecord?.status === "Absent";

  const evidence = record?.evidence ?? [];

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          {loading
            ? "Loading student..."
            : student?.name ?? "Practical Evidence"}
        </Text>

        <Text style={styles.subtitle}>
          {student?.rollNumber} • Add photo or video evidence of the
          practical assessment.
        </Text>

        {isAbsent && (
          <Text style={styles.absentNotice}>
            Student is absent. Practical evidence is not required.
          </Text>
        )}

        {evidence.length === 0 ? (
          <Text style={styles.emptyText}>
            No evidence added yet.
          </Text>
        ) : (
          <View style={styles.grid}>
            {evidence.map((item) => (
              <EvidenceThumbnail
                key={item.id}
                type={item.type}
                uri={item.uri}
                onPress={() =>
                  navigation.navigate("PracticalEvidenceViewer", {
                    assessmentId,
                    studentId,
                    evidenceId: item.id,
                  })
                }
              />
            ))}
          </View>
        )}

        <View style={styles.actions}>
          <View style={styles.actionButton}>
            <AppButton
              title="Add Photo"
              disabled={isAbsent}
              onPress={() =>
                navigation.navigate("PracticalPhotoCapture", {
                  assessmentId,
                  studentId,
                })
              }
            />
          </View>

          <View style={styles.actionButton}>
            <AppButton
              title="Record Video"
              disabled={isAbsent}
              onPress={() =>
                navigation.navigate("PracticalVideoRecorder", {
                  assessmentId,
                  studentId,
                })
              }
            />
          </View>
        </View>
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

  absentNotice: {
    fontSize: Typography.body,
    color: Colors.error,
    fontWeight: "700",
    textAlign: "center",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  actionButton: {
    flex: 1,
  },
});
