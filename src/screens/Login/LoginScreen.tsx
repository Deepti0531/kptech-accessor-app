import { StyleSheet, Text, View } from "react-native";

import Screen from "../../components/common/Screen";
import AppCard from "../../components/common/AppCard";
import LoginHeader from "../../screens/Login/LoginHeader";
import LoginForm from "../../screens/Login/LoginForm";
import { Colors} from "../../theme/colors";
import { Spacing} from "../../theme/spacing";

export default function LoginScreen() {
  return (
    <Screen>
      <LoginHeader />

      <View style={styles.formContainer}>
        <AppCard>
          <LoginForm />
        </AppCard>
      </View>

      <Text style={styles.version}>
        Version 1.0.0
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },

  version: {
    textAlign: "center",
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    fontSize: 12,
  },
});