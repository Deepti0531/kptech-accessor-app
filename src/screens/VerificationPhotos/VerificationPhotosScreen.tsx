import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../components/common/Screen";
import PhotoSlot from "../../components/photo/PhotoSlot";

import { RootStackParamList } from "../../navigation/AppNavigator";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import { useAssessment } from "../../context/AssessmentContext";
import { verificationTypeConfig } from "../../data/verificationTypeConfig";

type VerificationPhotosRouteProp = RouteProp<
  RootStackParamList,
  "VerificationPhotos"
>;

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

export default function VerificationPhotosScreen() {
  const navigation = useNavigation<NavigationProp>();

  const route = useRoute<VerificationPhotosRouteProp>();
  const { assessment } = useAssessment();

  const {
    assessmentId,
    verificationType,
  } = route.params;

  const { title, requiredPhotos } = verificationTypeConfig[verificationType];

  const photos = assessment.verification[verificationType].photos;

  const uploadedCount = photos.filter(
    photo => photo !== undefined
  ).length;

  return (
    <Screen>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        <Text style={styles.heading}>
          {title}
        </Text>

        <Text style={styles.subtitle}>
          Capture all the required photos.
        </Text>

        <View style={styles.container}>
          {Array.from({
            length: requiredPhotos,
          }).map((_, index) => (
           <PhotoSlot
    key={index}
    title={`Photo ${index + 1}`}
    photoUri={photos[index]?.uri}
   onPress={() => {
    if (photos[index]) {
      navigation.navigate("PhotoDetails", {
        assessmentId,
        verificationType,
        photoIndex: index,
      });
    } else {
      navigation.navigate("CameraCapture", {
        assessmentId,
        verificationType,
        photoIndex: index,
      });
    }
  }}
  />
          ))}
        </View>

        <Text style={styles.progress}>
    {uploadedCount} / {requiredPhotos} uploaded
  </Text>

      </ScrollView>

    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  heading: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  subtitle: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xl,
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  container: {
    gap: Spacing.lg,
  },

  progress: {
    marginTop: Spacing.xl,
    textAlign: "center",
    fontSize: Typography.body,
    fontWeight: "600",
    color: Colors.primary,
  },
});