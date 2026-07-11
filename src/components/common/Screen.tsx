import React, { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Colors} from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
};

export default function Screen({ children }: ScreenProps) {
  return (
  <SafeAreaView style={styles.safeArea}>
  <TouchableWithoutFeedback
    onPress={Keyboard.dismiss}
  >
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <View style={styles.container}>
        {children}
      </View>
    </KeyboardAvoidingView>
  </TouchableWithoutFeedback>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  keyboard: {
    flex: 1,
  },

  container: {
    flex: 1,
    padding: Spacing.lg,
  },
});