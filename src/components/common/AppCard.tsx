import { ReactNode } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
} from "react-native";

import { Colors } from "../../theme/colors";
import { Spacing } from "../../theme/spacing";

type AppCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function AppCard({
  children,
  style,
}: AppCardProps) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,

    borderRadius: 16,

    padding: Spacing.lg,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 8,

    elevation: 4,
  },
});