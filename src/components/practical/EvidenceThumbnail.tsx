import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { EvidenceType } from "../../types/assessment";

type Props = {
  type: EvidenceType;
  uri: string;
  onPress: () => void;
};

export default function EvidenceThumbnail({ type, uri, onPress }: Props) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {type === "photo" ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.videoPlaceholder}>
          <Ionicons name="videocam" size={32} color={Colors.white} />
          <Text style={styles.videoLabel}>Video</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    marginBottom: Spacing.md,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  videoPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.secondary,
  },

  videoLabel: {
    marginTop: Spacing.xs,
    color: Colors.white,
    fontWeight: "600",
    fontSize: Typography.caption,
  },
});
