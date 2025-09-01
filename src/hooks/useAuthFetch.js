import { useAuth } from "../context/AuthContext";

export function useAuthFetch() {
  const { authTokens, logoutUser } = useAuth();

  const authFetch = async (url, options = {}) => {
    const headers = {
      ...(options.headers || {}),
      Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
    };

    const response = await fetch(url, {
      cache: "no-store",
      ...options,
      headers: {
        ...options.headers,
        Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
      },
    });

    // Handle 401 / expired token
    if (response.status === 401) {
      logoutUser();
    }

    return response;
  };

  return authFetch;
}
