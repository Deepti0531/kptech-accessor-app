import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Screen from "../../components/common/Screen";
import AssessmentCard from "../../components/assessment/AssessmentCard";

import {
  AssignedAssessment,
  getAssignedAssessments,
} from "../../services/assessments/assessmentsApi";
import {
  clearSession,
  getAssessorProfile,
} from "../../services/auth/services/authStorage";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../../navigation/AppNavigator";

export default function AssessmentsScreen() {

  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamList>
    >();

  const [assessments, setAssessments] = useState<AssignedAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessorName, setAssessorName] = useState<string | null>(null);

  useEffect(() => {
    getAssessorProfile().then((profile) => setAssessorName(profile?.fullName ?? null));
  }, []);

  const handleLogout = async () => {
    await clearSession();
    navigation.replace("Login");
  };

  const loadAssessments = useCallback(async () => {
    try {
      setError(null);
      const data = await getAssignedAssessments();
      setAssessments(data);
    } catch {
      setError("Couldn't load your assessments. Pull down to try again.");
    }
  }, []);

  useEffect(() => {
    loadAssessments().finally(() => setLoading(false));
  }, [loadAssessments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAssessments();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {assessorName ? `Hi, ${assessorName}` : "Your assessments"}
          </Text>
          <Text style={styles.title}>Assigned to you</Text>
        </View>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      <FlatList
        style={styles.list}
        data={assessments}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          !error ? (
            <Text style={styles.emptyText}>
              No assessments assigned to you yet.
            </Text>
          ) : null
        }
        renderItem={({ item }) => (

<AssessmentCard
  batch={item.batch_name}
  center={item.training_centre ?? "Centre not set"}
  students={item.student_count}
  assessmentDate={item.scheduled_date ?? "Not scheduled"}
  assessmentTime={item.scheduled_time ?? ""}
  status={item.status as "Not Started" | "In Progress" | "Completed"}
  currentStep={item.current_step}
  onPress={() =>
    navigation.navigate("AssessmentWorkspace", {
      assessmentId: String(item.id),
    })
  }
/>

        )}
      />

    </Screen>
  );
}

const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.lg,
  },

  logout: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: Typography.caption,
  },

  greeting: {
    fontSize: Typography.heading,
    fontWeight: "700",
    color: Colors.textPrimary,
  },

  title: {
    marginTop: Spacing.sm,
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },

  list: {
    flex: 1,
  },

  listContent: {
    gap: Spacing.lg,
    paddingBottom: 40,
    flexGrow: 1,
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  errorText: {
    color: "#DC2626",
    fontSize: Typography.caption,
    marginBottom: Spacing.md,
  },

  emptyText: {
    textAlign: "center",
    marginTop: Spacing.xl,
    color: Colors.textSecondary,
    fontSize: Typography.body,
  },

});
