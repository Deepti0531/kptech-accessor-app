import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  Assessment,
  VerificationType,
  VerificationPhoto,
  AttendanceStatus,
  EvidenceType,
  EvidenceItem,
  VivaSpeaker,
  VivaClip,
} from "../types/assessment";

import { students } from "../data/studentsData";

interface AssessmentContextType {
  assessment: Assessment;

  setAssessment: React.Dispatch<
    React.SetStateAction<Assessment>
  >;

  addPhoto: (
  type: VerificationType,
  photoIndex: number,
  photoUri: string
) => void;

  deletePhoto: (
    type: VerificationType,
    index?: number
  ) => void;

  markAttendance: (
    studentId: string,
    status: AttendanceStatus
  ) => void;

  addAadhaarPhoto: (
    studentId: string,
    photoUri: string
  ) => void;

  deleteAadhaarPhoto: (
    studentId: string
  ) => void;

  addPracticalEvidence: (
    studentId: string,
    type: EvidenceType,
    uri: string
  ) => void;

  deletePracticalEvidence: (
    studentId: string,
    evidenceId: string
  ) => void;

  addVivaClip: (
    studentId: string,
    roundId: string,
    speaker: VivaSpeaker,
    uri: string
  ) => void;

  deleteVivaClip: (
    studentId: string,
    roundId: string,
    speaker: VivaSpeaker
  ) => void;
}

const AssessmentContext =
  createContext<AssessmentContextType | undefined>(
    undefined
  );

export function AssessmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [assessment, setAssessment] =
    useState<Assessment>({
      id: "assessment-1",
      batch: "Demo Batch",
      center: "Demo Center",
      assessmentDate: "",
      assessmentTime: "",
      students: 0,
      status: "Not Started",
      currentStep: 0,

     verification: {
    arrival: {
        photos: [
            undefined,
        ],
        lastUpdated: undefined,
    },

    centre: {
        photos: [
            undefined,
            undefined,
            undefined,
        ],
        lastUpdated: undefined,
    },

    infrastructure: {
        photos: [
            undefined,
            undefined,
            undefined,
            undefined,
        ],
        lastUpdated: undefined,
    },

    attendanceSheet: {
        photos: [undefined],
        lastUpdated: undefined,
    },

    evaluationSheet: {
        photos: [undefined],
        lastUpdated: undefined,
    },

    assessorDeclaration: {
        photos: [undefined],
        lastUpdated: undefined,
    },
},

      attendance: {
        records: students.map((student) => ({
          studentId: student.id,
          status: "Not Marked",
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
    });

  const addPhoto = (
    type: VerificationType,
    photoIndex: number,
    photoUri: string
  ) => {
    const newPhoto: VerificationPhoto = {
      id: Date.now().toString(),
      uri: photoUri,
      createdAt: new Date().toISOString(),
    };

    setAssessment((prev) => {
      const section = prev.verification[type];
      const photos = [...section.photos];
      photos[photoIndex] = newPhoto;

      return {
        ...prev,
        verification: {
          ...prev.verification,
          [type]: {
            ...section,
            photos,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    });
  };

  const deletePhoto = (
    type: VerificationType,
    index?: number
  ) => {
    setAssessment((prev) => {
      const section = prev.verification[type];
      const photos = [...section.photos];

      if (index !== undefined) {
        photos[index] = undefined;
      }

      return {
        ...prev,
        verification: {
          ...prev.verification,
          [type]: {
            ...section,
            photos,
            lastUpdated: new Date().toISOString(),
          },
        },
      };
    });
  };

  const markAttendance = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    setAssessment((prev) => ({
      ...prev,
      attendance: {
        records: prev.attendance.records.map((record) =>
          record.studentId === studentId
            ? {
                ...record,
                status,
                markedAt: new Date().toISOString(),
              }
            : record
        ),
      },
    }));
  };

  const addAadhaarPhoto = (
    studentId: string,
    photoUri: string
  ) => {
    const newPhoto: VerificationPhoto = {
      id: Date.now().toString(),
      uri: photoUri,
      createdAt: new Date().toISOString(),
    };

    setAssessment((prev) => ({
      ...prev,
      attendance: {
        records: prev.attendance.records.map((record) =>
          record.studentId === studentId
            ? { ...record, aadhaarPhoto: newPhoto }
            : record
        ),
      },
    }));
  };

  const deleteAadhaarPhoto = (studentId: string) => {
    setAssessment((prev) => ({
      ...prev,
      attendance: {
        records: prev.attendance.records.map((record) =>
          record.studentId === studentId
            ? { ...record, aadhaarPhoto: undefined }
            : record
        ),
      },
    }));
  };

  const addPracticalEvidence = (
    studentId: string,
    type: EvidenceType,
    uri: string
  ) => {
    const newItem: EvidenceItem = {
      id: Date.now().toString(),
      type,
      uri,
      createdAt: new Date().toISOString(),
    };

    setAssessment((prev) => ({
      ...prev,
      practical: {
        records: prev.practical.records.map((record) =>
          record.studentId === studentId
            ? { ...record, evidence: [...record.evidence, newItem] }
            : record
        ),
      },
    }));
  };

  const deletePracticalEvidence = (
    studentId: string,
    evidenceId: string
  ) => {
    setAssessment((prev) => ({
      ...prev,
      practical: {
        records: prev.practical.records.map((record) =>
          record.studentId === studentId
            ? {
                ...record,
                evidence: record.evidence.filter(
                  (item) => item.id !== evidenceId
                ),
              }
            : record
        ),
      },
    }));
  };

  const addVivaClip = (
    studentId: string,
    roundId: string,
    speaker: VivaSpeaker,
    uri: string
  ) => {
    const newClip: VivaClip = {
      id: Date.now().toString(),
      speaker,
      uri,
      createdAt: new Date().toISOString(),
    };

    const clipKey = speaker === "question" ? "questionClip" : "answerClip";

    setAssessment((prev) => ({
      ...prev,
      viva: {
        records: prev.viva.records.map((record) => {
          if (record.studentId !== studentId) return record;

          const existingRound = record.rounds.find(
            (round) => round.id === roundId
          );

          if (!existingRound) {
            return {
              ...record,
              rounds: [
                ...record.rounds,
                {
                  id: roundId,
                  createdAt: new Date().toISOString(),
                  [clipKey]: newClip,
                },
              ],
            };
          }

          return {
            ...record,
            rounds: record.rounds.map((round) =>
              round.id === roundId
                ? { ...round, [clipKey]: newClip }
                : round
            ),
          };
        }),
      },
    }));
  };

  const deleteVivaClip = (
    studentId: string,
    roundId: string,
    speaker: VivaSpeaker
  ) => {
    const clipKey = speaker === "question" ? "questionClip" : "answerClip";

    setAssessment((prev) => ({
      ...prev,
      viva: {
        records: prev.viva.records.map((record) =>
          record.studentId === studentId
            ? {
                ...record,
                rounds: record.rounds.map((round) =>
                  round.id === roundId
                    ? { ...round, [clipKey]: undefined }
                    : round
                ),
              }
            : record
        ),
      },
    }));
  };

  return (
    <AssessmentContext.Provider
      value={{
        assessment,
        setAssessment,
        addPhoto,
        deletePhoto,
        markAttendance,
        addAadhaarPhoto,
        deleteAadhaarPhoto,
        addPracticalEvidence,
        deletePracticalEvidence,
        addVivaClip,
        deleteVivaClip,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);

  if (!context) {
    throw new Error(
      "useAssessment must be used inside AssessmentProvider."
    );
  }

  return context;
}