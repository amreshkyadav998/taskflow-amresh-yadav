import { useMutation } from "@tanstack/react-query";
import { apiClient, ApiClientError } from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: LoginPayload) =>
      apiClient.post<AuthResponse>("/auth/login", data),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: RegisterPayload) =>
      apiClient.post<AuthResponse>("/auth/register", data),
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}

export function useAuthError(error: Error | null): string | null {
  if (!error) return null;
  if (error instanceof ApiClientError) {
    if (error.data.fields) {
      return Object.values(error.data.fields).join(", ");
    }
    return error.data.error;
  }
  return "An unexpected error occurred";
}
