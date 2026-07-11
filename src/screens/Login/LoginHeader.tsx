import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

export default function LoginHeader() {
  return (
    <View style={styles.container}>
      {/* Placeholder Logo */}
      <View style={styles.logo}>
        <Text style={styles.logoText}>AMP</Text>
      </View>

      <Text style={styles.title}>
        Assessment Management Platform
      </Text>

      <Text style={styles.subtitle}>
        Assessor Mobile Application
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 50,
  },

  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  logoText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: "bold",
  },

  title: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },

  subtitle: {
    marginTop: Spacing.sm,
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
});