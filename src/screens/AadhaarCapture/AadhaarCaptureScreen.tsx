import { useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";

import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type AadhaarCaptureRouteProp = RouteProp<
  RootStackParamList,
  "AadhaarCapture"
>;

export default function AadhaarCaptureScreen() {
  const cameraRef = useRef<CameraView>(null);

  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AadhaarCaptureRouteProp>();

  const { assessmentId, studentId } = route.params;

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>
            Camera Permission Required
          </Text>

          <Text style={styles.permissionText}>
            This app needs access to your camera to capture the student's
            Aadhaar card.
          </Text>

          <AppButton
            title="Grant Permission"
            onPress={requestPermission}
          />
        </View>
      </Screen>
    );
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        Alert.alert("Error", "Unable to capture photo.");
        return;
      }

      navigation.navigate("AadhaarPreview", {
        assessmentId,
        studentId,
        photoUri: photo.uri,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to capture photo.");
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Capture Aadhaar Card</Text>

      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      />

      <AppButton
        title="Take Photo"
        onPress={handleTakePhoto}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
  },

  camera: {
    height: 450,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: Spacing.xl,
  },

  permissionContainer: {
    flex: 1,
    justifyContent: "center",
  },

  permissionTitle: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  permissionText: {
    fontSize: Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
});
