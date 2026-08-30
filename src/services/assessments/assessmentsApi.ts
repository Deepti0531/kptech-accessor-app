import { api } from "../api";

// Matches AssignedAssessmentOut in kptech-backend/app/modules/assessor/schemas.py.
// Deliberately lighter than the `Assessment` type in `types/assessment.ts`,
// which still backs the (still-mocked) single-assessment workspace screens.
export interface AssignedAssessment {
  id: number;
  batch_name: string;
  qp_title: string | null;
  training_provider: string | null;
  training_centre: string | null;
  student_count: number;
  scheduled_date: string | null;
  scheduled_time: string | null;
  status: string;
  current_step: number;
}

export interface AssignedBatchStudent {
  id: number;
  full_name: string;
  father_name: string;
  aadhaar_number: string;
  enrollment_id: string;
}

export async function getAssignedAssessments(): Promise<AssignedAssessment[]> {
  const response = await api.get<AssignedAssessment[]>("/assessor/assessments");
  return response.data;
}

export async function getAssignedBatchStudents(
  batchId: number
): Promise<AssignedBatchStudent[]> {
  const response = await api.get<AssignedBatchStudent[]>(
    `/assessor/batches/${batchId}/students`
  );
  return response.data;
}
