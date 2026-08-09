import { api } from "../../../services/api";

import {
  LoginRequest,
  LoginResponse,
} from "../types/auth.types";

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {

  const response =
    await api.post<LoginResponse>(
      "/assessor/login",
      request
    );

  return response.data;
}