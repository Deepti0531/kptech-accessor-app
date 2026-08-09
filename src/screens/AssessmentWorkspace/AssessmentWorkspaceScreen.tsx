import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import AssessmentSectionsList from "../../components/workspace/AssessmentSectionsList";

import {
  AssignedAssessment,
  getAssignedAssessments,
} from "../../services/assessments/assessmentsApi";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type RouteProps = RouteProp<
  RootStackParamList,
  "AssessmentWorkspace"
>;

export default function AssessmentWorkspaceScreen() {

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const route = useRoute<RouteProps>();

  const [assessment, setAssessment] = useState<AssignedAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // No single-record endpoint yet — the list is small enough (one
    // assessor's own assignments) that fetching it and matching by id here
    // is fine for now.
    getAssignedAssessments()
      .then((list) => {
        const match = list.find(
          (item) => String(item.id) === route.params.assessmentId
        );
        setAssessment(match ?? null);
      })
      .finally(() => setLoading(false));
  }, [route.params.assessmentId]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!assessment) {
    return (
      <Screen>
        <Text>Assessment not found.</Text>
      </Screen>
    );
  }

  return (
    <Screen>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        <View>

          <Text style={styles.batch}>
            Batch {assessment.batch_name}
          </Text>

          <Text style={styles.center}>
            {assessment.training_centre ?? "Centre not set"}
          </Text>

        </View>

        <Text style={styles.heading}>
          Assessment Sections
        </Text>

        <AssessmentSectionsList
          currentStep={assessment.current_step}

          onCenterVerification={() =>
            navigation.navigate(
              "CenterVerification",
              {
                assessmentId: route.params.assessmentId,
              }
            )
          }

          onAttendance={() =>
            navigation.navigate(
              "StudentAttendance",
              {
                assessmentId: route.params.assessmentId,
              }
            )
          }

          onPractical={() =>
            navigation.navigate(
              "PracticalAssessment",
              {
                assessmentId: route.params.assessmentId,
              }
            )
          }

          onViva={() =>
            navigation.navigate(
              "VivaAssessment",
              {
                assessmentId: route.params.assessmentId,
              }
            )
          }

          onDocuments={() =>
            navigation.navigate(
              "DocumentsUpload",
              {
                assessmentId: route.params.assessmentId,
              }
            )
          }

          onSubmission={() =>
            navigation.navigate(
              "FinalSubmission",
              {
                assessmentId: route.params.assessmentId,
              }
            )
          }
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
    gap: Spacing.xl,
  },

  batch: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  center: {
    marginTop: Spacing.sm,
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  heading: {
    fontSize: Typography.subHeading,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

});
