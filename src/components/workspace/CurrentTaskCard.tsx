import { StyleSheet, Text, View } from "react-native";

import AppCard from "../common/AppCard";
import AppButton from "../common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  title: string;
  description: string;
  buttonText: string;
  onPress: () => void;
};

export default function CurrentTaskCard({
  title,
  description,
  buttonText,
  onPress,
}: Props) {
  return (
    <AppCard>

      <Text style={styles.sectionTitle}>
        Current Task
      </Text>

      <Text style={styles.taskTitle}>
        {title}
      </Text>

      <Text style={styles.description}>
        {description}
      </Text>

      <AppButton
        title={buttonText}
        onPress={onPress}
      />

    </AppCard>
  );
}

const styles = StyleSheet.create({

  sectionTitle: {
    fontSize: Typography.caption,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
  },

  taskTitle: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  description: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },

});