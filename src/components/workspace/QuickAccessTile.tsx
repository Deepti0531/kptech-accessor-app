import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AppCard from "../common/AppCard";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  icon: string;
  title: string;
  status: "Current" | "Completed" | "Pending";
  onPress: () => void;
};

export default function QuickAccessTile({
  icon,
  title,
  status,
  onPress,
}: Props) {
  const statusColor =
    status === "Completed"
      ? "#16A34A"
      : status === "Current"
      ? "#2563EB"
      : "#6B7280";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.wrapper}
      onPress={onPress}
    >
      <AppCard>

        <Text style={styles.icon}>
          {icon}
        </Text>

        <Text style={styles.title}>
          {title}
        </Text>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: statusColor,
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {status}
          </Text>
        </View>

      </AppCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "48%",
  },

  icon: {
    fontSize: 30,
    marginBottom: Spacing.md,
  },

  title: {
    fontSize: Typography.body,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  badgeText: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 12,
  },
});