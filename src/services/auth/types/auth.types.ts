export interface LoginRequest {
  username: string;
  password: string;
}

// Matches AssessorLoginOut in kptech-backend/app/modules/assessor/schemas.py
export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  assessor_id: number;
  full_name: string;
}
