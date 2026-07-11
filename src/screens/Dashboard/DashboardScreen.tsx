import { View } from "react-native";

import Screen from "../../components/common/Screen";
import AppButton from "../../components/common/AppButton";
import AppInput from "../../components/common/AppInput";

export default function DashboardScreen() {
  return (
    <Screen>
      <AppInput
        label="Username"
        placeholder="Enter username"
      />

      <AppButton
        title="Test Button"
        onPress={() => console.log("Pressed")}
      />
    </Screen>
  );
}