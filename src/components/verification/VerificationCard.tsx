import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AppCard from "../common/AppCard";
import AppButton from "../common/AppButton";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  title: string;
  imageUri?: string;
  completed: boolean;
  onCapture: () => void;
  onPreview?: () => void;
  onRetake?: () => void;
};

export default function VerificationCard({
  title,
  imageUri,
  completed,
  onCapture,
  onPreview,
  onRetake,
}: Props) {
  return (
    <AppCard>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.previewContainer}>
        {completed ? (
          <Image
            source={{
              uri:
                imageUri ??
                "https://placehold.co/600x400/png?text=Captured+Image",
            }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.camera}>📷</Text>

            <Text style={styles.placeholderText}>
              No Image Captured
            </Text>
          </View>
        )}
      </View>

      {!completed ? (
        <AppButton
          title="Capture"
          onPress={onCapture}
        />
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onPreview}>
            <Text style={styles.link}>
              Preview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onRetake}>
            <Text style={styles.link}>
              Retake
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Typography.subHeading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  previewContainer: {
    marginVertical: Spacing.md,
  },

  placeholder: {
    height: 180,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  camera: {
    fontSize: 48,
  },

  placeholderText: {
    marginTop: Spacing.sm,
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },

  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: Spacing.md,
  },

  link: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: Typography.body,
  },
});