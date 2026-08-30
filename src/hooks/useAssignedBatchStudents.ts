import { useEffect, useState } from "react";

import {
  AssignedBatchStudent,
  getAssignedBatchStudents,
} from "../services/assessments/assessmentsApi";
import { Student } from "../types/assessment";

function maskAadhaar(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 4) return "XXXX XXXX XXXX";
  return `XXXX XXXX ${digits.slice(-4)}`;
}

function toStudent(student: AssignedBatchStudent): Student {
  return {
    id: String(student.id),
    name: student.full_name,
    rollNumber: student.enrollment_id,
    aadhaarNumber: maskAadhaar(student.aadhaar_number),
  };
}

export function useAssignedBatchStudents(assessmentId: string) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const batchId = Number(assessmentId);

    async function loadStudents() {
      if (!Number.isFinite(batchId)) {
        setStudents([]);
        setError("Invalid assessment selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const rows = await getAssignedBatchStudents(batchId);
        if (!cancelled) setStudents(rows.map(toStudent));
      } catch {
        if (!cancelled) {
          setStudents([]);
          setError("Couldn't load students for this batch.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStudents();

    return () => {
      cancelled = true;
    };
  }, [assessmentId]);

  return { students, loading, error };
}
