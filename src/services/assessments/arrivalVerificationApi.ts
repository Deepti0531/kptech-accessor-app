import { api } from "../api";

interface SubmitArrivalVerificationParams {
  batchId: number;
  photoUri: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
}

export interface ArrivalVerification {
  id: number;
  batch_id: number;
  latitude: number | null;
  longitude: number | null;
  accuracy_m: number | null;
  captured_at: string;
}

// POST /assessor/center-verification/arrival — multipart, matching
// ArrivalVerificationOut in kptech-backend/app/modules/assessor/schemas.py.
export async function submitArrivalVerification({
  batchId,
  photoUri,
  latitude,
  longitude,
  accuracy,
}: SubmitArrivalVerificationParams): Promise<ArrivalVerification> {
  const formData = new FormData();
  formData.append("batch_id", String(batchId));
  if (latitude !== undefined) formData.append("latitude", String(latitude));
  if (longitude !== undefined) formData.append("longitude", String(longitude));
  if (accuracy !== undefined) formData.append("accuracy_m", String(accuracy));

  // React Native's fetch/FormData wants { uri, name, type } rather than a
  // real File/Blob — this shape is what expo-camera's takePictureAsync uri
  // needs to upload correctly.
  formData.append("file", {
    uri: photoUri,
    name: "arrival.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  const response = await api.post<ArrivalVerification>(
    "/assessor/center-verification/arrival",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
}
