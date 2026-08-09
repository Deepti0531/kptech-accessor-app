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
  disabled?: boolean;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[
  styles.button,
  (loading || disabled) && styles.buttonDisabled,
]}
      onPress={onPress}
      disabled={loading || disabled}
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
  buttonDisabled: {
  opacity: 0.6,
},
});