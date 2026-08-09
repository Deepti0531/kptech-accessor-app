import AppNavigator from "./src/navigation/AppNavigator";
import { AssessmentProvider } from "./src/context/AssessmentContext";

export default function App() {
  return (
    <AssessmentProvider>
      <AppNavigator />
    </AssessmentProvider>
  );
}