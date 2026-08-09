import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { getToken } from "../../services/auth/services/authStorage";
import { Colors } from "../../theme/colors";
import { RootStackParamList } from "../../navigation/AppNavigator";

// Startup auth gate: decides whether a returning assessor with a still-valid
// token skips straight to the Assessments list, or needs to log in again.
// A stored token here only proves one was saved — an expired/revoked token
// still fails the first authenticated call, which api.ts's caller handles.
export default function SplashScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    let cancelled = false;

    getToken()
      .then((token) => {
        if (cancelled) return;
        navigation.replace(token ? "Assessments" : "Login");
      })
      .catch(() => {
        // SecureStore hiccup (e.g. first-launch keystore init) — fail open to
        // Login rather than stranding the user on this spinner forever.
        if (!cancelled) navigation.replace("Login");
      });

    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
  },
});
