import { Image, StyleSheet, Text, View } from "react-native";

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
import { students } from "../../../data/studentsData";

import { Colors } from "../../../theme/colors";
import { Spacing } from "../../../theme/spacing";
import { Typography } from "../../../theme/typography";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type DetailsRouteProp = RouteProp<RootStackParamList, "AadhaarDetails">;

export default function AadhaarDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRouteProp>();

  const { assessment, deleteAadhaarPhoto } = useAssessment();

  const { assessmentId, studentId } = route.params;

  const student = students.find((item) => item.id === studentId);

  const record = assessment.attendance.records.find(
    (item) => item.studentId === studentId
  );

  const photo = record?.aadhaarPhoto;

  if (!photo) {
    navigation.goBack();
    return null;
  }

  return (
    <Screen>
      <Text style={styles.title}>
        {student?.name ?? "Aadhaar Photo"}
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
              navigation.replace("AadhaarCapture", {
                assessmentId,
                studentId,
              })
            }
          />
        </View>

        <View style={styles.button}>
          <AppButton
            title="Delete"
            onPress={() => {
              deleteAadhaarPhoto(studentId);
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
