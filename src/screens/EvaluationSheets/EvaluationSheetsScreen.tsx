import { ScrollView, StyleSheet, Text } from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";
import VerificationItem from "../../components/verification/VerificationItem";
import VerificationProgress from "../../components/verification/VerificationProgress";

import { useAssessment } from "../../context/AssessmentContext";
import { useAssignedBatchStudents } from "../../hooks/useAssignedBatchStudents";
import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = RouteProp<RootStackParamList, "EvaluationSheets">;

export default function EvaluationSheetsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { assessment } = useAssessment();
  const { assessmentId } = route.params;
  const { students, loading, error } = useAssignedBatchStudents(assessmentId);

  const absentStudentIds = new Set(
    assessment.attendance.records
      .filter((record) => record.status === "Absent")
      .map((record) => record.studentId)
  );
  const presentStudents = students.filter(
    (student) => !absentStudentIds.has(student.id)
  );
  const photos = assessment.verification.evaluationSheet.photos;
  const uploadedCount = presentStudents.filter((student) =>
    photos.some((photo) => photo?.studentId === student.id)
  ).length;

  const getNextPhotoIndex = () => {
    const emptyIndex = photos.findIndex((photo) => photo === undefined);
    return emptyIndex === -1 ? photos.length : emptyIndex;
  };

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Evaluation Sheets</Text>

        <Text style={styles.subtitle}>
          Upload the completed evaluation sheet for each present student.
        </Text>

        {loading ? (
          <Text style={styles.emptyText}>Loading students...</Text>
        ) : error ? (
          <Text style={styles.emptyText}>{error}</Text>
        ) : presentStudents.length === 0 ? (
          <Text style={styles.emptyText}>
            No present students found for evaluation sheets.
          </Text>
        ) : (
          presentStudents.map((student) => {
            const photo = photos.find(
              (item) => item?.studentId === student.id
            );
            const photoIndex = photo
              ? photos.findIndex((item) => item?.id === photo.id)
              : getNextPhotoIndex();

            return (
              <VerificationItem
                key={student.id}
                title={student.name}
                subtitle={`${student.rollNumber} - Evaluation sheet`}
                icon="document-text-outline"
                completed={!!photo}
                completedAt={
                  photo?.createdAt
                    ? new Date(photo.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : undefined
                }
                onPress={() =>
                  photo
                    ? navigation.navigate("PhotoDetails", {
                        assessmentId,
                        verificationType: "evaluationSheet",
                        photoIndex,
                      })
                    : navigation.navigate("CameraCapture", {
                        assessmentId,
                        verificationType: "evaluationSheet",
                        photoIndex,
                        studentId: student.id,
                      })
                }
              />
            );
          })
        )}

        <VerificationProgress
          title="Evaluation Sheets Progress"
          completed={uploadedCount}
          total={presentStudents.length}
        />

        <AppButton
          title="Back to Documents"
          variant="secondary"
          onPress={() => navigation.goBack()}
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
