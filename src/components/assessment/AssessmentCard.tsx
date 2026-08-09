import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppCard from "../common/AppCard";
import AssessmentProgress from "./AssessmentProgress";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import AppButton from "../common/AppButton";

type Props = {
  batch: string;
  center: string;
  students: number;
  assessmentDate: string;
  assessmentTime: string;
  status: "Not Started" | "In Progress" | "Completed";
  currentStep: number;
  onPress: () => void;
};

export default function AssessmentCard({
  batch,
  center,
  students,
  assessmentDate,
  assessmentTime,
  status,
  currentStep,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
    >
      <AppCard>

        <Text style={styles.batch}>
          Batch {batch}
        </Text>

        <Text style={styles.center}>
          {center}
        </Text>

        <View style={styles.row}>
          <Text style={styles.info}>
            📅 {assessmentDate}
          </Text>

          <Text style={styles.info}>
            🕘 {assessmentTime}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.info}>
            👥 {students} Students
          </Text>

          <Text
            style={[
              styles.status,
              status === "Completed"
                ? styles.completed
                : status === "In Progress"
                ? styles.inProgress
                : styles.notStarted,
            ]}
          >
            {status}
          </Text>
        </View>

        <View style={styles.progressSection}>
          <AssessmentProgress
            currentStep={currentStep}
          />
        </View>

        <View style={styles.divider} />

   <View style={styles.buttonContainer}>
  <AppButton
    title={
      status === "Not Started"
        ? "Start Assessment"
        : status === "In Progress"
        ? "Continue Assessment"
        : "View Assessment"
    }
    onPress={onPress}
  />
</View>

      </AppCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.lg,
  },

  info: {
    fontSize: Typography.caption,
    color: Colors.textPrimary,
  },

  status: {
    fontWeight: "700",
    fontSize: Typography.caption,
  },

  notStarted: {
    color: "#F59E0B",
  },

  inProgress: {
    color: "#2563EB",
  },

  completed: {
    color: "#16A34A",
  },

  progressSection: {
    marginTop: Spacing.xl,
  },

  divider: {
    marginVertical: Spacing.lg,
    height: 1,
    backgroundColor: "#E5E7EB",
  },

  open: {
    textAlign: "center",
    color: Colors.primary,
    fontWeight: "700",
    fontSize: Typography.body,
  },
  buttonContainer: {
  marginTop: 24,
},

});