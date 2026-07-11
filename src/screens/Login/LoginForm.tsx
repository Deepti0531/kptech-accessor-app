import { useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import {
  loginSchema,
  LoginFormData,
} from "../../services/auth/validation/loginSchema";

export default function LoginForm() {
  // Temporary state (we'll remove these after migrating the password field)
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleLogin = (data: LoginFormData) => {
    console.log("Form Submitted");
    console.log(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <Text style={styles.subtitle}>
        Login to continue your assessment
      </Text>

      {/* Username */}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <AppInput
            label="Username"
            placeholder="Enter your username"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
      />

      {/* Password (will migrate to Controller next) */}
      <AppInput
        ref={passwordRef}
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        returnKeyType="done"
        rightElement={
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        }
      />

      <View style={styles.buttonContainer}>
        <AppButton
          title="Login"
          onPress={handleSubmit(handleLogin)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },

  title: {
    fontSize: Typography.title,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  subtitle: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },

  buttonContainer: {
    marginTop: Spacing.lg,
  },
});