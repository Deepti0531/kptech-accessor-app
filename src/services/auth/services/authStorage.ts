import * as SecureStore
from "expo-secure-store";

const TOKEN_KEY = "access_token";
const ASSESSOR_ID_KEY = "assessor_id";
const ASSESSOR_NAME_KEY = "assessor_name";

export async function saveToken(
  token: string
) {
  await SecureStore.setItemAsync(
    TOKEN_KEY,
    token
  );
}

export async function getToken() {
  return SecureStore.getItemAsync(
    TOKEN_KEY
  );
}

export async function removeToken() {
  return SecureStore.deleteItemAsync(
    TOKEN_KEY
  );
}

export async function saveAssessorProfile(
  assessorId: number,
  fullName: string
) {
  await SecureStore.setItemAsync(
    ASSESSOR_ID_KEY,
    String(assessorId)
  );
  await SecureStore.setItemAsync(
    ASSESSOR_NAME_KEY,
    fullName
  );
}

export async function getAssessorProfile() {
  const [id, name] = await Promise.all([
    SecureStore.getItemAsync(ASSESSOR_ID_KEY),
    SecureStore.getItemAsync(ASSESSOR_NAME_KEY),
  ]);

  if (!id || !name) return null;

  return { assessorId: Number(id), fullName: name };
}

export async function clearSession() {
  await Promise.all([
    SecureStore.deleteItemAsync(TOKEN_KEY),
    SecureStore.deleteItemAsync(ASSESSOR_ID_KEY),
    SecureStore.deleteItemAsync(ASSESSOR_NAME_KEY),
  ]);
}
