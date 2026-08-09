import { useState } from "react";
import { AxiosError } from "axios";

import { login } from "../api/authApi";

import { saveToken, saveAssessorProfile }
from "../services/authStorage";

import { LoginRequest }
from "../types/auth.types";

export function useLogin() {

  const [loading, setLoading]
      = useState(false);

  async function signIn(
      request: LoginRequest
  ) {
    try {
      setLoading(true);
      const response =
        await login(request);

      await saveToken(
        response.access_token
      );
      await saveAssessorProfile(
        response.assessor_id,
        response.full_name
      );

      return response;
    } catch (error) {
      const detail =
        error instanceof AxiosError
          ? (error.response?.data?.detail as string | undefined)
          : undefined;

      throw new Error(
        detail ?? "Unable to sign in. Check your connection and try again."
      );
    } finally {
      setLoading(false);
    }

  }

  return {

    signIn,

    loading,

  };

}
