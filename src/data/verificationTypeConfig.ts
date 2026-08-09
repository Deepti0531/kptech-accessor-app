import { VerificationType } from "../types/assessment";

export type VerificationTypeConfig = {
  title: string;
  subtitle: string;
  requiredPhotos: number;
};

export const verificationTypeConfig: Record<
  VerificationType,
  VerificationTypeConfig
> = {
  arrival: {
    title: "Arrival Verification",
    subtitle: "Capture a selfie of the assessor at the assessment centre.",
    requiredPhotos: 1,
  },
  centre: {
    title: "Assessment Centre",
    subtitle: "Upload three photographs of the assessment centre.",
    requiredPhotos: 3,
  },
  infrastructure: {
    title: "Infrastructure",
    subtitle: "Upload four infrastructure photographs.",
    requiredPhotos: 4,
  },
  attendanceSheet: {
    title: "Attendance Sheet",
    subtitle: "Capture the signed attendance sheet.",
    requiredPhotos: 1,
  },
  evaluationSheet: {
    title: "Evaluation Sheet",
    subtitle: "Capture the completed evaluation / mark sheet.",
    requiredPhotos: 1,
  },
  assessorDeclaration: {
    title: "Assessor Declaration",
    subtitle: "Capture the signed assessor declaration form.",
    requiredPhotos: 1,
  },
};
