import { Assessment } from "../types/assessment";
import { students } from "./studentsData";

// Fake single-workspace data still consumed by AssessmentWorkspaceScreen and
// its children — real per-batch verification/attendance/practical/viva
// persistence is Phase 2. Kept here (rather than deleted) since those screens
// still read from it; AssessmentsScreen itself now sources its list from the
// real /assessor/assessments endpoint instead.
function emptyWorkspaceState() {
  return {
    verification: {
      arrival: { photos: [undefined], lastUpdated: undefined },
      centre: { photos: [undefined, undefined, undefined], lastUpdated: undefined },
      infrastructure: {
        photos: [undefined, undefined, undefined, undefined],
        lastUpdated: undefined,
      },
      attendanceSheet: { photos: [undefined], lastUpdated: undefined },
      evaluationSheet: { photos: [undefined], lastUpdated: undefined },
      assessorDeclaration: { photos: [undefined], lastUpdated: undefined },
    },
    attendance: {
      records: students.map((student) => ({
        studentId: student.id,
        status: "Not Marked" as const,
      })),
    },
    practical: {
      records: students.map((student) => ({
        studentId: student.id,
        evidence: [],
      })),
    },
    viva: {
      records: students.map((student) => ({
        studentId: student.id,
        rounds: [],
      })),
    },
  };
}

export const assessments: Assessment[] = [
  {
    id: "1",
    batch: "B102",
    center: "ABC Skill Development Centre",
    assessmentDate: "14 Jul 2026",
    assessmentTime: "09:00 AM",
    students: 25,
    status: "Not Started",
    currentStep: 0,
    ...emptyWorkspaceState(),
  },
  {
    id: "2",
    batch: "B103",
    center: "XYZ Training Centre",
    assessmentDate: "14 Jul 2026",
    assessmentTime: "02:00 PM",
    students: 18,
    status: "In Progress",
    currentStep: 2,
    ...emptyWorkspaceState(),
  },
];
