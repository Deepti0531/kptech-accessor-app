import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
button: {
    width: "100%",
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 10,
    alignItems: "center",
},

  text: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },
});