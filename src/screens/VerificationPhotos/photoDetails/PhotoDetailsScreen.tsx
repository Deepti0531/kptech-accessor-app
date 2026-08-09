import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Screen from "../../../components/common/Screen";
import AppButton from "../../../components/common/AppButton";

import { RootStackParamList } from "../../../navigation/AppNavigator";
import { useAssessment } from "../../../context/AssessmentContext";

import { Colors } from "../../../theme/colors";
import { Spacing } from "../../../theme/spacing";
import { Typography } from "../../../theme/typography";

type NavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

type DetailsRouteProp =
  RouteProp<RootStackParamList, "PhotoDetails">;

export default function PhotoDetailsScreen() {
  const navigation =
    useNavigation<NavigationProp>();

  const route =
    useRoute<DetailsRouteProp>();

  const {
    assessment,
    deletePhoto,
  } = useAssessment();

  const {
    assessmentId,
    verificationType,
    photoIndex,
  } = route.params;

  const photos = assessment.verification[verificationType].photos;

  const photo = photos[photoIndex];

  if (!photo) {
    navigation.goBack();
    return null;
  }

  return (
    <Screen>

      <Text style={styles.title}>
        Photo
      </Text>

      <Image
        source={{ uri: photo.uri }}
        style={styles.image}
      />

      <View style={styles.row}>
        <View style={styles.button}>
          <AppButton
            title="Replace"
            onPress={() =>
              navigation.replace(
                "CameraCapture",
                {
                  assessmentId,
                  verificationType,
                  photoIndex,
                }
              )
            }
          />
        </View>

        <View style={styles.button}>
          <AppButton
            title="Delete"
            onPress={() => {
              deletePhoto(
                verificationType,
                photoIndex
              );

              navigation.goBack();
            }}
          />
        </View>
      </View>

      <AppButton
        title="Close"
        onPress={() => navigation.goBack()}
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

  image: {
    width: "100%",
    height: 450,
    borderRadius: 16,
    marginBottom: Spacing.xl,
  },

  row: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },

  button: {
    flex: 1,
  },
});