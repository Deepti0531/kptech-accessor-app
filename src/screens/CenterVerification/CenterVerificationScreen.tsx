import { useAssessment } from "../../context/AssessmentContext";
import { ScrollView, StyleSheet, Text } from "react-native";

import Screen from "../../components/common/Screen";
import VerificationItem from "../../components/verification/VerificationItem";
import VerificationProgress from "../../components/verification/VerificationProgress";
import AppButton from "../../components/common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type CenterVerificationRouteProp = RouteProp<RootStackParamList, "CenterVerification">;


export default function CenterVerificationScreen() {
    // Progress counts (photos captured so far) still come from the shared
    // mock context — that part of center verification stays Phase 2. But the
    // *real* assessment/batch id has to come from route params, not the
    // context's hardcoded "assessment-1" — the arrival upload needs the real
    // numeric batch id to reach the backend correctly.
    const { assessment } = useAssessment();
    const { assessmentId } = useRoute<CenterVerificationRouteProp>().params;
    const arrivalUploaded =
  assessment.verification.arrival.photos.filter(
    photo => photo !== undefined
  ).length;

const centreUploaded =
  assessment.verification.centre.photos.filter(
    photo => photo !== undefined
  ).length;

const infrastructureUploaded =
  assessment.verification.infrastructure.photos.filter(
    photo => photo !== undefined
  ).length;

const arrivalDone = arrivalUploaded === 1;
const centreDone = centreUploaded === 3;
const infraDone = infrastructureUploaded === 4;

  const navigation = useNavigation<NavigationProp>();
 


  const completedCount =
    Number(arrivalDone) +
    Number(centreDone) +
    Number(infraDone);

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          Assessment Center Verification
        </Text>

        <Text style={styles.subtitle}>
          Complete all mandatory verification before proceeding to Student
          Attendance.
        </Text>

        <VerificationItem
          title="Assessor Arrival Photo"
          subtitle="Capture a selfie of the assessor at the assessment centre."
          icon="camera-outline"
          completed={arrivalDone}
          completedAt={
  assessment.verification.centre.lastUpdated
    ? new Date(
        assessment.verification.centre.lastUpdated
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : undefined
}
          onPress={() =>
  navigation.navigate("VerificationPhotos", {
    assessmentId,
    verificationType: "arrival",
})
}
        />

        <VerificationItem
          title="Assessment Centre"
          subtitle="Upload three photographs of the assessment centre."
          icon="business-outline"
          completed={centreDone}
          uploadedCount={centreUploaded}
          totalCount={3}
          completedAt={
            centreDone
              ? new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined
          }
          onPress={() =>
  navigation.navigate("VerificationPhotos", {
    assessmentId,
    verificationType: "centre",
})
}
        />

        <VerificationItem
          title="Infrastructure"
          subtitle="Upload four infrastructure photographs."
          icon="desktop-outline"
          completed={infraDone}
          uploadedCount={infrastructureUploaded}
          totalCount={4}
          completedAt={
            infraDone
              ? new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : undefined
          }
          onPress={() =>
  navigation.navigate("VerificationPhotos", {
    assessmentId,
    verificationType: "infrastructure",
})
}
        />

        <VerificationProgress
          completed={completedCount}
          total={3}
        />

        <AppButton
          title="Continue"
          disabled={completedCount !== 3}
          onPress={() => {
            navigation.navigate("StudentAttendance", {
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
});