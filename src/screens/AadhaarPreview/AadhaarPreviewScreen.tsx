import { StyleSheet, Text, View, Image } from "react-native";
import {
  useNavigation,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { RootStackParamList } from "../../navigation/AppNavigator";
import { useAssessment } from "../../context/AssessmentContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type PreviewRouteProp = RouteProp<RootStackParamList, "AadhaarPreview">;

export default function AadhaarPreviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PreviewRouteProp>();

  const { addAadhaarPhoto } = useAssessment();

  const { studentId, photoUri } = route.params;

  const handleUsePhoto = () => {
    addAadhaarPhoto(studentId, photoUri);

    // Back to Camera
    navigation.goBack();

    // Back to Student Attendance
    navigation.goBack();
  };

  return (
    <Screen>
      <Text style={styles.title}>
        Aadhaar Photo Preview
      </Text>

      <Image
        source={{ uri: photoUri }}
        style={styles.image}
      />

      <View style={styles.actions}>
        <View style={styles.buttonContainer}>
          <AppButton
            title="Retake"
            onPress={() => navigation.goBack()}
          />
        </View>

        <View style={styles.buttonContainer}>
          <AppButton
            title="Use Photo"
            onPress={handleUsePhoto}
          />
        </View>
      </View>
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

  image: {
    width: "100%",
    height: 450,
    borderRadius: 20,
    marginBottom: Spacing.xl,
  },

  actions: {
    flexDirection: "row",
    gap: Spacing.md,
  },

  buttonContainer: {
    flex: 1,
  },
});
