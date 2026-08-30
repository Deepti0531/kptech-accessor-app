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
  variant?: "primary" | "secondary" | "danger";
};

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        (loading || disabled) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === "secondary" && styles.secondaryText,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    padding: Spacing.md,
    borderRadius: 10,
    alignItems: "center",
  },

  primary: {
    backgroundColor: Colors.primary,
  },

  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  danger: {
    backgroundColor: Colors.error,
  },

  text: {
    color: Colors.white,
    fontWeight: "600",
    fontSize: 16,
  },

  secondaryText: {
    color: Colors.textPrimary,
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});
