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
  complete: boolean;
  onPress: () => void;
};

export default function ChecklistItem({
  title,
  subtitle,
  complete,
  onPress,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <AppCard>

        <View style={styles.container}>

          <View style={styles.leftSection}>

            <Ionicons
              name={complete ? "checkmark-circle" : "alert-circle-outline"}
              size={28}
              color={complete ? "#16A34A" : "#F59E0B"}
            />

            <View style={styles.textSection}>

              <Text style={styles.title}>
                {title}
              </Text>

              <Text style={styles.subtitle}>
                {subtitle}
              </Text>

              <Text
                style={complete ? styles.completedText : styles.pendingText}
              >
                {complete ? "Complete" : "Incomplete"}
              </Text>

            </View>

          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={Colors.textSecondary}
          />

        </View>

      </AppCard>
    </TouchableOpacity>
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
    alignItems: "center",
    flex: 1,
    gap: Spacing.md,
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
  },

  pendingText: {
    marginTop: 8,
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  completedText: {
    marginTop: 8,
    color: "#16A34A",
    fontWeight: "600",
    fontSize: Typography.caption,
  },

});
