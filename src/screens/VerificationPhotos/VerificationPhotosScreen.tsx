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
import AppButton from "../../components/common/AppButton";
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
  const flexibleDocumentTypes = new Set([
    "attendanceSheet",
    "assessorDeclaration",
  ]);
  const isFlexibleDocumentType = flexibleDocumentTypes.has(verificationType);

  const uploadedCount = photos.filter(
    photo => photo !== undefined
  ).length;
  const slotCount = isFlexibleDocumentType
    ? Math.max(requiredPhotos, photos.length + 1)
    : requiredPhotos;
  const uploadedPhotos = photos
    .map((photo, index) => ({ photo, index }))
    .filter((item) => item.photo !== undefined);
  const nextPhotoIndex = (() => {
    const emptyIndex = photos.findIndex((photo) => photo === undefined);
    return emptyIndex === -1 ? photos.length : emptyIndex;
  })();

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
          {isFlexibleDocumentType
            ? uploadedPhotos.map(({ photo, index }, displayIndex) => (
                <PhotoSlot
                  key={photo?.id ?? index}
                  title={`Photo ${displayIndex + 1}`}
                  photoUri={photo?.uri}
                  onPress={() =>
                    navigation.navigate("PhotoDetails", {
                      assessmentId,
                      verificationType,
                      photoIndex: index,
                    })
                  }
                />
              ))
            : Array.from({
                length: slotCount,
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

        {isFlexibleDocumentType && (
          <AppButton
            title="Add Photo"
            onPress={() =>
              navigation.navigate("CameraCapture", {
                assessmentId,
                verificationType,
                photoIndex: nextPhotoIndex,
              })
            }
          />
        )}

        <Text style={styles.progress}>
    {isFlexibleDocumentType
      ? `${uploadedCount} uploaded`
      : `${uploadedCount} / ${requiredPhotos} uploaded`}
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
