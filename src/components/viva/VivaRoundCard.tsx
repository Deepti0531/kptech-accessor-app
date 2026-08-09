import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import AppCard from "../common/AppCard";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type LegProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  recorded: boolean;
  onRecord: () => void;
  onView: () => void;
};

function VivaLegRow({ icon, label, recorded, onRecord, onView }: LegProps) {
  return (
    <View style={styles.legRow}>

      <View style={styles.legLeft}>
        <Ionicons name={icon} size={20} color={Colors.primary} />

        <Text style={styles.legLabel}>
          {label}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.legButton, recorded && styles.legButtonRecorded]}
        onPress={recorded ? onView : onRecord}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.legButtonText,
            recorded && styles.legButtonTextRecorded,
          ]}
        >
          {recorded ? "View" : "Record"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

type Props = {
  roundNumber: number;
  hasQuestionClip: boolean;
  hasAnswerClip: boolean;
  onRecordQuestion: () => void;
  onViewQuestion: () => void;
  onRecordAnswer: () => void;
  onViewAnswer: () => void;
};

export default function VivaRoundCard({
  roundNumber,
  hasQuestionClip,
  hasAnswerClip,
  onRecordQuestion,
  onViewQuestion,
  onRecordAnswer,
  onViewAnswer,
}: Props) {
  return (
    <AppCard>

      <Text style={styles.title}>
        Question {roundNumber}
      </Text>

      <VivaLegRow
        icon="videocam-outline"
        label="Accessor Question"
        recorded={hasQuestionClip}
        onRecord={onRecordQuestion}
        onView={onViewQuestion}
      />

      <VivaLegRow
        icon="person-outline"
        label="Student Answer"
        recorded={hasAnswerClip}
        onRecord={onRecordAnswer}
        onView={onViewAnswer}
      />

    </AppCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },

  legRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },

  legLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },

  legLabel: {
    fontSize: Typography.caption,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  legButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },

  legButtonRecorded: {
    backgroundColor: "#DCFCE7",
  },

  legButtonText: {
    fontSize: Typography.caption,
    fontWeight: "700",
    color: Colors.white,
  },

  legButtonTextRecorded: {
    color: "#16A34A",
  },
});
