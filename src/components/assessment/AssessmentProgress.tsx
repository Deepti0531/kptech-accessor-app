import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";

type Props = {
  currentStep: number;
};

const steps = [
  "Center",
  "Attend",
  "Practical",
  "Viva",
  "Docs",
  "Submit",
];

export default function AssessmentProgress({
  currentStep,
}: Props) {
  return (
    <View>

      <Text style={styles.heading}>
        Assessment Progress
      </Text>

      <View style={styles.row}>

        {steps.map((step, index) => {

          const completed = index < currentStep;

          const active = index === currentStep;

          return (

            <View
              key={step}
              style={styles.step}
            >

              <View
                style={[
                  styles.circle,
                  completed &&
                    styles.completedCircle,
                  active &&
                    styles.activeCircle,
                ]}
              />

              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    completed &&
                      styles.completedLine,
                  ]}
                />
              )}

              <Text
                style={[
                  styles.label,
                  active &&
                    styles.activeLabel,
                ]}
              >
                {step}
              </Text>

            </View>

          );

        })}

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  heading: {
    fontWeight: "700",
    marginBottom: Spacing.md,
    color: Colors.textPrimary,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  step: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },

  circle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: Colors.white,
  },

  completedCircle: {
    backgroundColor: "#22C55E",
    borderColor: "#22C55E",
  },

  activeCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  line: {
    position: "absolute",
    top: 6,
    left: "50%",
    width: "100%",
    height: 2,
    backgroundColor: "#D1D5DB",
    zIndex: -1,
  },

  completedLine: {
    backgroundColor: "#22C55E",
  },

  label: {
    marginTop: 6,
    fontSize: 10,
    textAlign: "center",
    color: Colors.textSecondary,
  },

  activeLabel: {
    color: Colors.primary,
    fontWeight: "700",
  },

});