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

import { AttendanceStatus } from "../../types/assessment";

type Props = {
  name: string;
  rollNumber: string;
  aadhaarNumber: string;

  status: AttendanceStatus;
  aadhaarVerified: boolean;

  onMarkPresent: () => void;
  onMarkAbsent: () => void;
  onVerifyAadhaar: () => void;
};

export default function StudentAttendanceItem({
  name,
  rollNumber,
  aadhaarNumber,
  status,
  aadhaarVerified,
  onMarkPresent,
  onMarkAbsent,
  onVerifyAadhaar,
}: Props) {
  return (
    <AppCard>

      <View style={styles.container}>

        <View style={styles.iconContainer}>
          <Ionicons
            name="person-outline"
            size={26}
            color={Colors.primary}
          />
        </View>

        <View style={styles.textSection}>

          <Text style={styles.name}>
            {name}
          </Text>

          <Text style={styles.subtitle}>
            {rollNumber} • Aadhaar {aadhaarNumber}
          </Text>

          {status === "Present" ? (
            aadhaarVerified ? (
              <Text style={styles.completedText}>
                ✓ Aadhaar Verified
              </Text>
            ) : (
              <Text style={styles.pendingText}>
                Aadhaar Pending
              </Text>
            )
          ) : status === "Absent" ? (
            <Text style={styles.absentText}>
              Marked Absent
            </Text>
          ) : (
            <Text style={styles.pendingText}>
              Not Marked
            </Text>
          )}

        </View>

      </View>

      <View style={styles.row}>

        <TouchableOpacity
          style={[
            styles.toggle,
            status === "Present" && styles.togglePresentActive,
          ]}
          onPress={onMarkPresent}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              status === "Present" && styles.toggleTextActive,
            ]}
          >
            Present
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggle,
            status === "Absent" && styles.toggleAbsentActive,
          ]}
          onPress={onMarkAbsent}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.toggleText,
              status === "Absent" && styles.toggleTextActive,
            ]}
          >
            Absent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.verifyButton,
            status !== "Present" && styles.verifyButtonDisabled,
          ]}
          onPress={onVerifyAadhaar}
          disabled={status !== "Present"}
          activeOpacity={0.8}
        >
          <Text style={styles.verifyButtonText}>
            {aadhaarVerified ? "View" : "Verify"}
          </Text>
        </TouchableOpacity>

      </View>

    </AppCard>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.md,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EEF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },

  textSection: {
    flex: 1,
  },

  name: {
    fontSize: Typography.body,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  subtitle: {
    marginTop: 4,
    color: Colors.textSecondary,
    fontSize: Typography.caption,
  },

  pendingText: {
    marginTop: 8,
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  completedText: {
    marginTop: 8,
    color: "#16A34A",
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  absentText: {
    marginTop: 8,
    color: Colors.error,
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },

  toggle: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },

  togglePresentActive: {
    backgroundColor: "#DCFCE7",
    borderColor: "#16A34A",
  },

  toggleAbsentActive: {
    backgroundColor: "#FEE2E2",
    borderColor: Colors.error,
  },

  toggleText: {
    fontSize: Typography.caption,
    fontWeight: "600",
    color: Colors.textSecondary,
  },

  toggleTextActive: {
    color: Colors.textPrimary,
  },

  verifyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },

  verifyButtonDisabled: {
    opacity: 0.5,
  },

  verifyButtonText: {
    fontSize: Typography.caption,
    fontWeight: "700",
    color: Colors.white,
  },

});
