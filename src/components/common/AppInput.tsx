import React, { forwardRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";

type AppInputProps = TextInputProps & {
  label: string;
  rightElement?: React.ReactNode;
};


const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ label, rightElement, ...props }, ref) => {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            ref={ref}
            style={styles.input}
            placeholderTextColor={Colors.textSecondary}
            {...props}
          />

          {rightElement}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },

  label: {
    marginBottom: Spacing.sm,
    color: Colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
  },

input: {
  flex: 1,
  paddingVertical: Spacing.md,
  paddingHorizontal: Spacing.md,
  fontSize: 16,
  color: Colors.textPrimary,
},
inputContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: 10,
  backgroundColor: Colors.white,
  paddingRight: Spacing.md,
},
});
export default AppInput;