import { StyleSheet, Text, View } from "react-native";

import QuickAccessTile from "./QuickAccessTile";

import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { Colors } from "../../theme/colors";

export default function QuickAccessGrid() {
  return (
    <View>

      <Text style={styles.heading}>
        Quick Access
      </Text>

      <View style={styles.grid}>

        <QuickAccessTile
          icon="📷"
          title="Center Verification"
          status="Current"
          onPress={() => {}}
        />

        <QuickAccessTile
          icon="👥"
          title="Attendance"
          status="Pending"
          onPress={() => {}}
        />

        <QuickAccessTile
          icon="🧪"
          title="Practical"
          status="Pending"
          onPress={() => {}}
        />

        <QuickAccessTile
          icon="🎤"
          title="Viva"
          status="Pending"
          onPress={() => {}}
        />

        <QuickAccessTile
          icon="📄"
          title="Documents"
          status="Pending"
          onPress={() => {}}
        />

        <QuickAccessTile
          icon="✅"
          title="Submission"
          status="Pending"
          onPress={() => {}}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
});