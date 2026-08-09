import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

interface PhotoSlotProps {
  title: string;
  photoUri?: string;
  onPress: () => void;
}

export default function PhotoSlot({
  title,
  photoUri,
  onPress,
}: PhotoSlotProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      {photoUri ? (
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.plus}>+</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 190,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
  },

  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  plus: {
    fontSize: 48,
    color: Colors.primary,
    fontWeight: "300",
  },

  title: {
    marginTop: Spacing.sm,
    fontSize: Typography.body,
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  image: {
    width: "100%",
    height: "100%",
  },
});