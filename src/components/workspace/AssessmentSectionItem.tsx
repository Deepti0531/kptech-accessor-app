import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "../common/AppCard";
import StatusChip from "./StatusChip";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  title: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  status: "Current" | "Pending" | "Completed";
  isCurrent?: boolean;
  completedAt?: string;
  onPress: () => void;
};

export default function AssessmentSectionItem({
  title,
  subtitle,
  icon,
  status,
  isCurrent = false,
  completedAt,
  onPress,
}: Props) {
    
  return (
    
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
    >
 <AppCard
  style={[
    styles.card,
    isCurrent && styles.currentCard,
  ]}
>

        <View style={styles.container}>

          {/* Left Side */}

          <View style={styles.leftSection}>

            <View style={styles.iconContainer}>
              <Ionicons
                name={icon}
                size={26}
                color={Colors.primary}
              />
            </View>

            <View style={styles.textContainer}>

              <Text style={styles.title}>
                {title}
              </Text>

              {subtitle && (
                <Text style={styles.subtitle}>
                  {subtitle}
                </Text>
              )}

              {completedAt && (
  <Text style={styles.completedAt}>
    Completed at {completedAt}
  </Text>
)}

            </View>

          </View>

          {/* Right Side */}

          <View style={styles.rightSection}>

            <StatusChip
              status={status}
            />

            <Ionicons
              name="chevron-forward"
              size={22}
              color={Colors.textSecondary}
              style={styles.arrow}
            />

          </View>

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
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  subtitle: {
    marginTop: 4,
    fontSize: Typography.caption,
    color: Colors.textSecondary,
  },

  rightSection: {
    alignItems: "flex-end",
  },

  arrow: {
    marginTop: 8,
  },
  card: {
  borderLeftWidth: 4,
  borderLeftColor: "transparent",
},

currentCard: {
  borderLeftColor: Colors.primary,
},

completedAt: {
  marginTop: 4,
  fontSize: Typography.caption,
  color: "#16A34A",
  fontWeight: "600",
},

});