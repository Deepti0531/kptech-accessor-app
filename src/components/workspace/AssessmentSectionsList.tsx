import { View, StyleSheet } from "react-native";

import AssessmentSectionItem from "./AssessmentSectionItem";

import { Spacing } from "../../theme/spacing";
import { assessmentSections } from "../../data/assessmentSections";

type Props = {
  currentStep: number;

  onCenterVerification: () => void;
  onAttendance: () => void;
  onPractical: () => void;
  onViva: () => void;
  onDocuments: () => void;
  onSubmission: () => void;
};


export default function AssessmentSectionsList({
  currentStep,
  onCenterVerification,
  onAttendance,
  onPractical,
  onViva,
  onDocuments,
  onSubmission,
}: Props) {
    const actions = [
  onCenterVerification,
  onAttendance,
  onPractical,
  onViva,
  onDocuments,
  onSubmission,
];

  const getStatus = (
    index: number
  ): "Current" | "Pending" | "Completed" => {

    if (index < currentStep) {
      return "Completed";
    }

    if (index === currentStep) {
      return "Current";
    }

    return "Pending";
  };

  return (
    <View style={styles.container}>
  {assessmentSections.map((section, index) => (
    <AssessmentSectionItem
      key={section.id}
      title={section.title}
      subtitle={section.subtitle}
      icon={section.icon}
      status={getStatus(index)}
      isCurrent={index === currentStep}
      onPress={
        currentStep >= index
          ? actions[index]
          : () => {}
      }
    />
  ))}
</View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
});