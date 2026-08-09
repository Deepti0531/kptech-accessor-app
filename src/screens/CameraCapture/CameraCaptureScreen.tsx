import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CameraView, useCameraPermissions} from "expo-camera";
import * as Location from "expo-location";
import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";
import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigator";
import type { RouteProp } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type CameraRouteProp = RouteProp<
  RootStackParamList,
  "CameraCapture"
>;

export default function CameraCaptureScreen() {
  const cameraRef = useRef<CameraView>(null);

  const navigation =
    useNavigation<NavigationProp>();

  const route =
    useRoute<CameraRouteProp>();

  const {
  assessmentId,
  verificationType,
  photoIndex,
} = route.params;

  const [permission, requestPermission] =
    useCameraPermissions();

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
            This app needs access to your camera to capture
            verification photographs.
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

    // Geo-tag only the arrival photo — proves the assessor was physically at
    // the centre. A denied/unavailable location never blocks the capture;
    // it just uploads without coordinates.
    let latitude: number | undefined;
    let longitude: number | undefined;
    let accuracy: number | undefined;

    if (verificationType === "arrival") {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const position = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
          accuracy = position.coords.accuracy ?? undefined;
        }
      } catch (locationError) {
        console.error(locationError);
      }
    }

navigation.navigate("PhotoPreview", {
  assessmentId,
  verificationType,
  photoIndex,
  photoUri: photo.uri,
  latitude,
  longitude,
  accuracy,
});

  } catch (error) {
    console.error(error);
    Alert.alert("Error", "Failed to capture photo.");
  }
};

  return (
    <Screen>
      <Text style={styles.title}>Camera</Text>

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


