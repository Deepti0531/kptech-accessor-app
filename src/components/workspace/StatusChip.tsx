import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";

type Props = {
  status: "Current" | "Pending" | "Completed";
};

export default function StatusChip({
  status,
}: Props) {

  const backgroundColor =
    status === "Completed"
      ? "#DCFCE7"
      : status === "Current"
      ? "#DBEAFE"
      : "#F3F4F6";

  const textColor =
    status === "Completed"
      ? "#15803D"
      : status === "Current"
      ? "#2563EB"
      : "#6B7280";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
          },
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },

  text: {
    fontWeight: "600",
    fontSize: 12,
  },

});