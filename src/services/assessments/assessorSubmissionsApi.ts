import { api } from "../api";
import { AttendanceStatus, EvidenceType, VerificationType, VivaSpeaker } from "../../types/assessment";

interface SubmissionOut {
  id: number;
  batch_id: number;
  student_id?: number | null;
  evidence_type: string;
  captured_at: string;
}

interface AttendanceOut {
  id: number;
  batch_id: number;
  student_id: number;
  status: AttendanceStatus;
  marked_at: string;
  updated_at: string;
}

function fileNameFor(type: string, uri: string): string {
  const extension = uri.split(".").pop()?.split("?")[0] || "jpg";
  return `${type}.${extension}`;
}

function appendFile(formData: FormData, uri: string, name: string, type: string) {
  formData.append("file", {
    uri,
    name,
    type,
  } as unknown as Blob);
}

export async function markStudentAttendance({
  batchId,
  studentId,
  status,
}: {
  batchId: number;
  studentId: number;
  status: AttendanceStatus;
}): Promise<AttendanceOut> {
  const response = await api.post<AttendanceOut>("/assessor/attendance/status", {
    batch_id: batchId,
    student_id: studentId,
    status,
  });
  return response.data;
}

export async function submitAadhaarPhoto({
  batchId,
  studentId,
  photoUri,
}: {
  batchId: number;
  studentId: number;
  photoUri: string;
}): Promise<AttendanceOut> {
  const formData = new FormData();
  formData.append("batch_id", String(batchId));
  formData.append("student_id", String(studentId));
  appendFile(formData, photoUri, "aadhaar.jpg", "image/jpeg");

  const response = await api.post<AttendanceOut>(
    "/assessor/attendance/aadhaar-photo",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function submitPracticalEvidence({
  batchId,
  studentId,
  evidenceType,
  fileUri,
}: {
  batchId: number;
  studentId: number;
  evidenceType: EvidenceType;
  fileUri: string;
}): Promise<SubmissionOut> {
  const formData = new FormData();
  formData.append("batch_id", String(batchId));
  formData.append("student_id", String(studentId));
  formData.append("evidence_type", evidenceType);
  appendFile(
    formData,
    fileUri,
    fileNameFor(`practical-${evidenceType}`, fileUri),
    evidenceType === "video" ? "video/mp4" : "image/jpeg"
  );

  const response = await api.post<SubmissionOut>(
    "/assessor/practical-evidence",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function submitVivaEvidence({
  batchId,
  studentId,
  roundId,
  speaker,
  videoUri,
}: {
  batchId: number;
  studentId: number;
  roundId: string;
  speaker: VivaSpeaker;
  videoUri: string;
}): Promise<SubmissionOut> {
  const formData = new FormData();
  formData.append("batch_id", String(batchId));
  formData.append("student_id", String(studentId));
  formData.append("round_id", roundId);
  formData.append("speaker", speaker);
  appendFile(formData, videoUri, fileNameFor(`viva-${speaker}`, videoUri), "video/mp4");

  const response = await api.post<SubmissionOut>(
    "/assessor/viva-evidence",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function submitAssessmentDocument({
  batchId,
  documentType,
  photoUri,
  studentId,
}: {
  batchId: number;
  documentType: VerificationType;
  photoUri: string;
  studentId?: number;
}): Promise<SubmissionOut> {
  const formData = new FormData();
  formData.append("batch_id", String(batchId));
  formData.append("document_type", documentType);
  if (studentId !== undefined) {
    formData.append("student_id", String(studentId));
  }
  appendFile(formData, photoUri, `${documentType}.jpg`, "image/jpeg");

  const response = await api.post<SubmissionOut>(
    "/assessor/documents",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}

export async function deleteAadhaarPhoto({
  batchId,
  studentId,
}: {
  batchId: number;
  studentId: number;
}): Promise<void> {
  await api.delete("/assessor/attendance/aadhaar-photo", {
    params: {
      batch_id: batchId,
      student_id: studentId,
    },
  });
}

export async function deletePracticalEvidence(evidenceId: number): Promise<void> {
  await api.delete(`/assessor/practical-evidence/${evidenceId}`);
}

export async function deleteVivaEvidence(evidenceId: number): Promise<void> {
  await api.delete(`/assessor/viva-evidence/${evidenceId}`);
}

export async function deleteAssessmentDocument({
  batchId,
  documentType,
}: {
  batchId: number;
  documentType: VerificationType;
}): Promise<void> {
  await api.delete("/assessor/documents", {
    params: {
      batch_id: batchId,
      document_type: documentType,
    },
  });
}

export async function deleteAssessmentDocumentById(
  documentId: number
): Promise<void> {
  await api.delete(`/assessor/documents/${documentId}`);
}
