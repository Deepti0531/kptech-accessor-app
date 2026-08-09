import { Image, StyleSheet, Text, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type RouteProps = RouteProp<
  RootStackParamList,
  "PracticalEvidenceViewer"
>;

export default function PracticalEvidenceViewerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { assessment, deletePracticalEvidence } = useAssessment();
  const { studentId, evidenceId } = route.params;

  const record = assessment.practical.records.find(
    (item) => item.studentId === studentId
  );

  const evidenceItem = record?.evidence.find(
    (item) => item.id === evidenceId
  );

  const player = useVideoPlayer(
    evidenceItem?.type === "video" ? evidenceItem.uri : null
  );

  if (!evidenceItem) {
    navigation.goBack();
    return null;
  }

  return (
    <Screen>
      <Text style={styles.title}>
        {evidenceItem.type === "photo" ? "Evidence Photo" : "Evidence Video"}
      </Text>

      {evidenceItem.type === "photo" ? (
        <Image
          source={{ uri: evidenceItem.uri }}
          style={styles.media}
        />
      ) : (
        <VideoView
          player={player}
          style={styles.media}
          nativeControls
        />
      )}

      <View style={styles.row}>
        <AppButton
          title="Delete"
          onPress={() => {
            deletePracticalEvidence(studentId, evidenceId);
            navigation.goBack();
          }}
        />
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

  media: {
    width: "100%",
    height: 450,
    borderRadius: 16,
    marginBottom: Spacing.xl,
    backgroundColor: Colors.black,
  },

  row: {
    marginBottom: Spacing.md,
  },
});
