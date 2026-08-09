import { Ionicons } from "@expo/vector-icons";

export type AssessmentSection = {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
};

export const assessmentSections: AssessmentSection[] = [
  {
    id: "center",
    title: "Center Verification",
    subtitle: "Capture assessor & centre photographs",
    icon: "camera-outline",
  },
  {
    id: "attendance",
    title: "Student Attendance",
    subtitle: "Verify attendance & Aadhaar",
    icon: "people-outline",
  },
  {
    id: "practical",
    title: "Practical Assessment",
    subtitle: "Capture practical evidence",
    icon: "flask-outline",
  },
  {
    id: "viva",
    title: "Viva Assessment",
    subtitle: "Capture viva evidence",
    icon: "mic-outline",
  },
  {
    id: "documents",
    title: "Documents Upload",
    subtitle: "Upload assessment documents",
    icon: "document-text-outline",
  },
  {
    id: "submission",
    title: "Final Submission",
    subtitle: "Review and submit assessment",
    icon: "checkmark-circle-outline",
  },
];