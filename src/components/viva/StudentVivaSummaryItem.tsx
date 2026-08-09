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
  name: string;
  rollNumber: string;
  completeRounds: number;
  totalRounds: number;
  onPress: () => void;
};

export default function StudentVivaSummaryItem({
  name,
  rollNumber,
  completeRounds,
  totalRounds,
  onPress,
}: Props) {
  const hasCompleteRound = completeRounds > 0;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <AppCard>

        <View style={styles.container}>

          <View style={styles.leftSection}>

            <View style={styles.iconContainer}>
              <Ionicons
                name="mic-outline"
                size={26}
                color={Colors.primary}
              />
            </View>

            <View style={styles.textSection}>

              <Text style={styles.name}>
                {name}
              </Text>

              <Text style={styles.subtitle}>
                {rollNumber}
              </Text>

              {hasCompleteRound ? (
                <Text style={styles.completedText}>
                  {completeRounds} of {totalRounds} rounds complete
                </Text>
              ) : totalRounds > 0 ? (
                <Text style={styles.pendingText}>
                  {totalRounds} round{totalRounds === 1 ? "" : "s"} in progress
                </Text>
              ) : (
                <Text style={styles.pendingText}>
                  No rounds yet
                </Text>
              )}

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
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  textSection: {
    flex: 1,
  },

  name: {
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
