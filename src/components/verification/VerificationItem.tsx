import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "../common/AppCard";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;

  completed: boolean;

  uploadedCount?: number;
  totalCount?: number;

  completedAt?: string;

  onPress: () => void;
};

export default function VerificationItem({
  title,
  subtitle,
  icon,
  completed,
 uploadedCount,
  totalCount,
  completedAt,
  onPress,
}: Props) {
  return (
    <AppCard>

      <View style={styles.container}>

        {/* Left Side */}

        <View style={styles.leftSection}>

          <View style={styles.iconContainer}>
            <Ionicons
              name={icon}
              size={28}
              color={Colors.primary}
            />
          </View>

          <View style={styles.textSection}>

            <Text style={styles.title}>
              {title}
            </Text>

            <Text style={styles.subtitle}>
              {subtitle}
            </Text>

            {completed ? (

              <Text style={styles.completedText}>
                ✓ Completed
                {completedAt ? ` • ${completedAt}` : ""}
              </Text>

            ) : uploadedCount !== undefined &&
              totalCount !== undefined ? (

              <Text style={styles.uploadCount}>
                {uploadedCount} / {totalCount} Uploaded
              </Text>

            ) : (

              <Text style={styles.pendingText}>
                Pending
              </Text>

            )}

          </View>

        </View>

        {/* Right Side */}

        <TouchableOpacity
          style={styles.button}
          onPress={onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {completed ? "View" : "Capture"}
          </Text>
        </TouchableOpacity>

      </View>

    </AppCard>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftSection: {
    flexDirection: "row",
    flex: 1,
    marginRight: Spacing.md,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  textSection: {
    flex: 1,
  },

  title: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  subtitle: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: Typography.caption,
    lineHeight: 18,
  },

  pendingText: {
    marginTop: 8,
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  uploadCount: {
    marginTop: 8,
    color: Colors.primary,
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  completedText: {
    marginTop: 8,
    color: "#16A34A",
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: Typography.caption,
  },

});