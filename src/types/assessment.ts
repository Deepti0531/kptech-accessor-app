export type AssessmentStatus =
  | "Not Started"
  | "In Progress"
  | "Completed";

export interface Assessment {
  id: string;

  batch: string;

  center: string;

  assessmentDate: string;

  assessmentTime: string;

  students: number;

  status: AssessmentStatus;

  currentStep: number;

  verification: AssessmentVerification;

  attendance: AttendanceState;

  practical: PracticalAssessmentState;

  viva: VivaAssessmentState;
}

export type VerificationType =
  | "arrival"
  | "centre"
  | "infrastructure"
  | "attendanceSheet"
  | "evaluationSheet"
  | "assessorDeclaration";

export interface AssessmentVerification {
    arrival: VerificationSection;
    centre: VerificationSection;
    infrastructure: VerificationSection;
    attendanceSheet: VerificationSection;
    evaluationSheet: VerificationSection;
    assessorDeclaration: VerificationSection;
}
export interface VerificationPhoto {
  id: string;
  uri: string;
  createdAt: string;
  studentId?: string;
}
export interface VerificationSection {
    photos: (VerificationPhoto | undefined)[];
    lastUpdated?: string;
}

export type AttendanceStatus =
  | "Not Marked"
  | "Present"
  | "Absent";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  aadhaarNumber: string;
}

export interface StudentAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  markedAt?: string;
  aadhaarPhoto?: VerificationPhoto;
}

export interface AttendanceState {
  records: StudentAttendanceRecord[];
}

export type EvidenceType = "photo" | "video";

export interface EvidenceItem {
  id: string;
  type: EvidenceType;
  uri: string;
  createdAt: string;
}

export interface StudentPracticalRecord {
  studentId: string;
  evidence: EvidenceItem[];
}

export interface PracticalAssessmentState {
  records: StudentPracticalRecord[];
}

export type VivaSpeaker = "question" | "answer";

export interface VivaClip {
  id: string;
  speaker: VivaSpeaker;
  uri: string;
  createdAt: string;
}

export interface VivaRound {
  id: string;
  createdAt: string;
  questionClip?: VivaClip;
  answerClip?: VivaClip;
}

export interface StudentVivaRecord {
  studentId: string;
  rounds: VivaRound[];
}

export interface VivaAssessmentState {
  records: StudentVivaRecord[];
}
