import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/Splash/SplashScreen";
import LoginScreen from "../screens/Login/LoginScreen";
import AssessmentsScreen from "../screens/Assessments/AssessmentScreen";
import AssessmentWorkspaceScreen from "../screens/AssessmentWorkspace/AssessmentWorkspaceScreen";
import CenterVerificationScreen from "../screens/CenterVerification/CenterVerificationScreen";
import CameraCaptureScreen from "../screens/CameraCapture/CameraCaptureScreen";
import PhotoPreviewScreen from "../screens/PhotoPreview/PhotoPreviewScreen";
import { VerificationType, VivaSpeaker } from "../types/assessment";
import VerificationPhotosScreen from "../screens/VerificationPhotos/VerificationPhotosScreen";
import PhotoDetailsScreen from "../screens/VerificationPhotos/photoDetails/PhotoDetailsScreen";
import StudentAttendanceScreen from "../screens/StudentAttendance/StudentAttendanceScreen";
import AadhaarCaptureScreen from "../screens/AadhaarCapture/AadhaarCaptureScreen";
import AadhaarPreviewScreen from "../screens/AadhaarPreview/AadhaarPreviewScreen";
import AadhaarDetailsScreen from "../screens/StudentAttendance/aadhaarDetails/AadhaarDetailsScreen";
import PracticalAssessmentScreen from "../screens/PracticalAssessment/PracticalAssessmentScreen";
import PracticalStudentEvidenceScreen from "../screens/PracticalAssessment/studentEvidence/PracticalStudentEvidenceScreen";
import PracticalEvidenceViewerScreen from "../screens/PracticalAssessment/evidenceViewer/PracticalEvidenceViewerScreen";
import PracticalPhotoCaptureScreen from "../screens/PracticalPhotoCapture/PracticalPhotoCaptureScreen";
import PracticalPhotoPreviewScreen from "../screens/PracticalPhotoPreview/PracticalPhotoPreviewScreen";
import PracticalVideoRecorderScreen from "../screens/PracticalVideoRecorder/PracticalVideoRecorderScreen";
import VivaAssessmentScreen from "../screens/VivaAssessment/VivaAssessmentScreen";
import VivaStudentRoundsScreen from "../screens/VivaAssessment/studentRounds/VivaStudentRoundsScreen";
import VivaClipViewerScreen from "../screens/VivaAssessment/clipViewer/VivaClipViewerScreen";
import VivaRecordingScreen from "../screens/VivaRecording/VivaRecordingScreen";
import VivaClipPreviewScreen from "../screens/VivaClipPreview/VivaClipPreviewScreen";
import DocumentsUploadScreen from "../screens/DocumentsUpload/DocumentsUploadScreen";
import EvaluationSheetsScreen from "../screens/EvaluationSheets/EvaluationSheetsScreen";
import FinalSubmissionScreen from "../screens/FinalSubmission/FinalSubmissionScreen";

export type RootStackParamList = {
  Splash: undefined;

  Login: undefined;

  Assessments: undefined;

  AssessmentWorkspace: {
    assessmentId: string;
  };

  CenterVerification: {
    assessmentId: string;
  };

CameraCapture: {
  assessmentId: string;
  verificationType: VerificationType;
  photoIndex: number;
  studentId?: string;
};

PhotoPreview: {
  assessmentId: string;
  verificationType: VerificationType;
  photoIndex: number;
  photoUri: string;
  // Only populated for the "arrival" verificationType — captured alongside
  // the photo in CameraCaptureScreen. Undefined when location permission was
  // denied/unavailable; the arrival photo still uploads without it.
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  studentId?: string;
};
  VerificationPhotos: {
  assessmentId: string;
  verificationType: VerificationType;
};
PhotoDetails: {
  assessmentId: string;
  verificationType: VerificationType;
  photoIndex: number;
};

StudentAttendance: {
  assessmentId: string;
};

AadhaarCapture: {
  assessmentId: string;
  studentId: string;
};

AadhaarPreview: {
  assessmentId: string;
  studentId: string;
  photoUri: string;
};

AadhaarDetails: {
  assessmentId: string;
  studentId: string;
};

PracticalAssessment: {
  assessmentId: string;
};

PracticalStudentEvidence: {
  assessmentId: string;
  studentId: string;
};

PracticalEvidenceViewer: {
  assessmentId: string;
  studentId: string;
  evidenceId: string;
};

PracticalPhotoCapture: {
  assessmentId: string;
  studentId: string;
};

PracticalPhotoPreview: {
  assessmentId: string;
  studentId: string;
  photoUri: string;
};

PracticalVideoRecorder: {
  assessmentId: string;
  studentId: string;
};

VivaAssessment: {
  assessmentId: string;
};

VivaStudentRounds: {
  assessmentId: string;
  studentId: string;
};

VivaClipViewer: {
  assessmentId: string;
  studentId: string;
  roundId: string;
  speaker: VivaSpeaker;
};

VivaRecording: {
  assessmentId: string;
  studentId: string;
  roundId: string;
  speaker: VivaSpeaker;
};

VivaClipPreview: {
  assessmentId: string;
  studentId: string;
  roundId: string;
  speaker: VivaSpeaker;
  videoUri: string;
};

DocumentsUpload: {
  assessmentId: string;
};

EvaluationSheets: {
  assessmentId: string;
};

FinalSubmission: {
  assessmentId: string;
};
};
const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Assessments"
          component={AssessmentsScreen}
        />

        <Stack.Screen
          name="AssessmentWorkspace"
          component={AssessmentWorkspaceScreen}
        />
        <Stack.Screen
  name="CenterVerification"
  component={CenterVerificationScreen}
/>

<Stack.Screen
  name="CameraCapture"
  component={CameraCaptureScreen}
/>

<Stack.Screen
  name="PhotoPreview"
  component={PhotoPreviewScreen}
/>
<Stack.Screen
    name="VerificationPhotos"
    component={VerificationPhotosScreen}
/>
<Stack.Screen
  name="PhotoDetails"
  component={PhotoDetailsScreen}
/>

<Stack.Screen
  name="StudentAttendance"
  component={StudentAttendanceScreen}
/>

<Stack.Screen
  name="AadhaarCapture"
  component={AadhaarCaptureScreen}
/>

<Stack.Screen
  name="AadhaarPreview"
  component={AadhaarPreviewScreen}
/>

<Stack.Screen
  name="AadhaarDetails"
  component={AadhaarDetailsScreen}
/>

<Stack.Screen
  name="PracticalAssessment"
  component={PracticalAssessmentScreen}
/>

<Stack.Screen
  name="PracticalStudentEvidence"
  component={PracticalStudentEvidenceScreen}
/>

<Stack.Screen
  name="PracticalEvidenceViewer"
  component={PracticalEvidenceViewerScreen}
/>

<Stack.Screen
  name="PracticalPhotoCapture"
  component={PracticalPhotoCaptureScreen}
/>

<Stack.Screen
  name="PracticalPhotoPreview"
  component={PracticalPhotoPreviewScreen}
/>

<Stack.Screen
  name="PracticalVideoRecorder"
  component={PracticalVideoRecorderScreen}
/>

<Stack.Screen
  name="VivaAssessment"
  component={VivaAssessmentScreen}
/>

<Stack.Screen
  name="VivaStudentRounds"
  component={VivaStudentRoundsScreen}
/>

<Stack.Screen
  name="VivaClipViewer"
  component={VivaClipViewerScreen}
/>

<Stack.Screen
  name="VivaRecording"
  component={VivaRecordingScreen}
/>

<Stack.Screen
  name="VivaClipPreview"
  component={VivaClipPreviewScreen}
/>

<Stack.Screen
  name="DocumentsUpload"
  component={DocumentsUploadScreen}
/>

<Stack.Screen
  name="EvaluationSheets"
  component={EvaluationSheetsScreen}
/>

<Stack.Screen
  name="FinalSubmission"
  component={FinalSubmissionScreen}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

