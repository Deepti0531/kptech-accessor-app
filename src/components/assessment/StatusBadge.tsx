import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { AssessmentStatus } from "../../types/assessment";

type Props = {
  status: AssessmentStatus;
};



export default function StatusBadge({
  status,
}: Props) {
  let backgroundColor = "#F59E0B";

  switch (status) {
    case "In Progress":
      backgroundColor = "#2563EB";
      break;

    case "Completed":
      backgroundColor = "#16A34A";
      break;
  }

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
        },
      ]}
    >
      <Text style={styles.text}>
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },

  text: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 12,
  },
});