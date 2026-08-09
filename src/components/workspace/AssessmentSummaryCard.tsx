import { StyleSheet, Text, View } from "react-native";

import AppCard from "../common/AppCard";

import { Assessment } from "../../types/assessment";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  assessment: Assessment;
};

export default function AssessmentSummaryCard({
  assessment,
}: Props) {
  return (
    <AppCard>

      <Text style={styles.batch}>
        Batch {assessment.batch}
      </Text>

      <Text style={styles.center}>
        {assessment.center}
      </Text>

      <View style={styles.row}>
        <Text style={styles.info}>
          📅 {assessment.assessmentDate}
        </Text>

        <Text style={styles.info}>
          🕘 {assessment.assessmentTime}
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.info}>
          👥 {assessment.students} Students
        </Text>

        <Text style={styles.status}>
          {assessment.status}
        </Text>
      </View>

    </AppCard>
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
    color: Colors.textSecondary,
    fontSize: Typography.body,
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
    color: Colors.primary,
    fontWeight: "700",
  },

});