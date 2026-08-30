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

interface AssessmentContextType {
  assessment: Assessment;

  setAssessment: React.Dispatch<
    React.SetStateAction<Assessment>
  >;

  addPhoto: (
  type: VerificationType,
  photoIndex: number,
  photoUri: string,
  photoId?: string,
  studentId?: string
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
    uri: string,
    evidenceId?: string
  ) => void;

  deletePracticalEvidence: (
    studentId: string,
    evidenceId: string
  ) => void;

  addVivaClip: (
    studentId: string,
    roundId: string,
    speaker: VivaSpeaker,
    uri: string,
    clipId?: string
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
        records: [],
      },

      practical: {
        records: [],
      },

      viva: {
        records: [],
      },
    });

  const addPhoto = (
    type: VerificationType,
    photoIndex: number,
    photoUri: string,
    photoId?: string,
    studentId?: string
  ) => {
    const newPhoto: VerificationPhoto = {
      id: photoId ?? Date.now().toString(),
      uri: photoUri,
      createdAt: new Date().toISOString(),
      studentId,
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
    const markedAt = new Date().toISOString();

    setAssessment((prev) => {
      const records = prev.attendance.records;
      const hasRecord = records.some(
        (record) => record.studentId === studentId
      );

      return {
        ...prev,
        attendance: {
          records: hasRecord
            ? records.map((record) =>
                record.studentId === studentId
                  ? {
                      ...record,
                      status,
                      markedAt,
                    }
                  : record
              )
            : [
                ...records,
                {
                  studentId,
                  status,
                  markedAt,
                },
              ],
        },
      };
    });
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

    setAssessment((prev) => {
      const records = prev.attendance.records;
      const hasRecord = records.some(
        (record) => record.studentId === studentId
      );

      return {
        ...prev,
        attendance: {
          records: hasRecord
            ? records.map((record) =>
                record.studentId === studentId
                  ? { ...record, aadhaarPhoto: newPhoto }
                  : record
              )
            : [
                ...records,
                {
                  studentId,
                  status: "Present",
                  markedAt: new Date().toISOString(),
                  aadhaarPhoto: newPhoto,
                },
              ],
        },
      };
    });
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
    uri: string,
    evidenceId?: string
  ) => {
    const newItem: EvidenceItem = {
      id: evidenceId ?? Date.now().toString(),
      type,
      uri,
      createdAt: new Date().toISOString(),
    };

    setAssessment((prev) => {
      const records = prev.practical.records;
      const hasRecord = records.some(
        (record) => record.studentId === studentId
      );

      return {
        ...prev,
        practical: {
          records: hasRecord
            ? records.map((record) =>
                record.studentId === studentId
                  ? {
                      ...record,
                      evidence: [...record.evidence, newItem],
                    }
                  : record
              )
            : [
                ...records,
                {
                  studentId,
                  evidence: [newItem],
                },
              ],
        },
      };
    });
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
    uri: string,
    clipId?: string
  ) => {
    const newClip: VivaClip = {
      id: clipId ?? Date.now().toString(),
      speaker,
      uri,
      createdAt: new Date().toISOString(),
    };

    const clipKey = speaker === "question" ? "questionClip" : "answerClip";

    setAssessment((prev) => {
      const createdAt = new Date().toISOString();
      const records = prev.viva.records;
      const hasRecord = records.some(
        (record) => record.studentId === studentId
      );

      const updatedRecords = records.map((record) => {
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
                  createdAt,
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
        });

      return {
        ...prev,
        viva: {
          records: hasRecord
            ? updatedRecords
            : [
                ...records,
                {
                  studentId,
                  rounds: [
                    {
                      id: roundId,
                      createdAt,
                      [clipKey]: newClip,
                    },
                  ],
                },
              ],
        },
      };
    });
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
