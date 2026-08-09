import { StyleSheet, Text, View } from "react-native";

import AppCard from "../common/AppCard";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  title?: string;
  completed: number;
  total: number;
};

export default function VerificationProgress({
  title = "Verification Progress",
  completed,
  total,
}: Props) {

  const percentage = (completed / total) * 100;

  return (
    <AppCard>

      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.progressBackground}>

        <View
          style={[
            styles.progressFill,
            {
              width: `${percentage}%`,
            },
          ]}
        />

      </View>

      <Text style={styles.text}>
        {completed} / {total} Completed
      </Text>

    </AppCard>
  );
}

const styles = StyleSheet.create({

  title: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  progressBackground: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 10,
  },

  text: {
    marginTop: Spacing.md,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

});