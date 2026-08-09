import { StyleSheet, Text, View } from "react-native";
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

type RouteProps = RouteProp<RootStackParamList, "VivaClipViewer">;

export default function VivaClipViewerScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();

  const { assessment, deleteVivaClip } = useAssessment();
  const { studentId, roundId, speaker } = route.params;

  const record = assessment.viva.records.find(
    (item) => item.studentId === studentId
  );

  const round = record?.rounds.find((item) => item.id === roundId);
  const clip = speaker === "question" ? round?.questionClip : round?.answerClip;

  const player = useVideoPlayer(clip?.uri ?? null);

  if (!clip) {
    navigation.goBack();
    return null;
  }

  return (
    <Screen>
      <Text style={styles.title}>
        {speaker === "question" ? "Accessor Question" : "Student Answer"}
      </Text>

      <VideoView
        player={player}
        style={styles.video}
        nativeControls
      />

      <View style={styles.row}>
        <AppButton
          title="Delete"
          onPress={() => {
            deleteVivaClip(studentId, roundId, speaker);
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

  video: {
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
