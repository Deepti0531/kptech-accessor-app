import { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View, TextInput,} from "react-native";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { loginSchema, LoginFormData,} from "../../services/auth/validation/loginSchema";
import { useLogin } from "../../services/auth/hooks/useLogin";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/AppNavigator";
export default function LoginForm() {

  const navigation =
  useNavigation<
    NativeStackNavigationProp<RootStackParamList>
  >();

  const { signIn, loading: isLoading } = useLogin();

  // Temporary state (we'll remove these after migrating the password field)
const [showPassword, setShowPassword] = useState(false);
const [loginError, setLoginError] = useState<string | null>(null);

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
  mode: "onBlur",
  reValidateMode: "onChange",
});



 const handleLogin = async (data: LoginFormData) => {
  setLoginError(null);

  try {
    await signIn(data);
    navigation.replace("Assessments");
  } catch (error) {
    setLoginError(
      error instanceof Error
        ? error.message
        : "Unable to sign in. Please try again."
    );
  }
};
  return (
    <View style={styles.container}>
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

{errors.username && (
  <Text style={styles.errorText}>
    {errors.username.message}
  </Text>
)}


      {/* Password (will migrate to Controller next) */}
<Controller
  control={control}
  name="password"
  render={({ field: { onChange, onBlur, value } }) => (
    <AppInput
      ref={passwordRef}
      label="Password"
      placeholder="Enter your password"
      value={value}
      onChangeText={onChange}
      onBlur={onBlur}
      secureTextEntry={!showPassword}
      returnKeyType="done"
      onSubmitEditing={handleSubmit(handleLogin)}
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
  )}
/>

{errors.password && (
  <Text style={styles.errorText}>
    {errors.password.message}
  </Text>
)}

{loginError && (
  <Text style={styles.errorText}>
    {loginError}
  </Text>
)}

      <View style={styles.buttonContainer}>
       <AppButton
  title="Login"
  loading={isLoading}
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
  errorText: {
  color: "#DC2626",
  fontSize: 13,
  marginTop: -Spacing.md,
  marginBottom: Spacing.md,
},
});