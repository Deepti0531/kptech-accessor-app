import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";

type Props = {
  currentStep: number;
};

const steps = [
  "Center",
  "Attendance",
  "Practical",
  "Viva",
  "Documents",
  "Submit",
];

export default function AssessmentWorkflow({
  currentStep,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.timeline}>

        {steps.map((step, index) => {

          const completed = index < currentStep;

          const active = index === currentStep;

          return (

            <View
              key={step}
              style={styles.stepContainer}
            >

              <View
                style={[
                  styles.circle,

                  completed && styles.completedCircle,

                  active && styles.activeCircle,
                ]}
              />

              <Text
                style={[
                  styles.label,

                  active && styles.activeLabel,
                ]}
              >
                {step}
              </Text>

              {index !== steps.length - 1 && (

                <View
                  style={[
                    styles.line,

                    completed && styles.completedLine,
                  ]}
                />

              )}

            </View>

          );

        })}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    marginTop: Spacing.xl,
  },

  title: {
    fontSize: Typography.subHeading,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },

  timeline: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  stepContainer: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },

  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: Colors.white,
  },

  completedCircle: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },

  activeCircle: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  line: {
    position: "absolute",
    top: 8,
    left: "55%",
    width: "100%",
    height: 3,
    backgroundColor: "#D1D5DB",
    zIndex: -1,
  },

  completedLine: {
    backgroundColor: "#22C55E",
  },

  label: {
    marginTop: Spacing.sm,
    textAlign: "center",
    fontSize: 12,
    color: Colors.textSecondary,
  },

  activeLabel: {
    color: Colors.primary,
    fontWeight: "700",
  },

});