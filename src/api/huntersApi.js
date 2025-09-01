// src/api/huntersApi.js
import { useAuthFetch } from "@/hooks/useAuthFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useHuntersApi() {
  const authFetch = useAuthFetch();

  const getHunters = async ({
    ordering = "id",
    search = "",
    rank = "all",
    isAdmin = false,
  } = {}) => {
    const params = new URLSearchParams();
    if (ordering) params.append("ordering", ordering);
    if (search) params.append("search", search);
    if (!isAdmin && rank !== "all") params.append("rank", rank);

    const res = await authFetch(
      `${API_BASE_URL}/hunters/?${params.toString()}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch hunters");
    return res.json();
  };

  const getHunter = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/hunters/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch hunter");
    return res.json();
  };

  const updateHunter = async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/hunters/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update hunter");
    return res.json();
  };

  const deleteHunter = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/hunters/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete hunter");
    return true;
  };

  const registerHunter = async (data) => {
    const res = await fetch(`${API_BASE_URL}/hunters/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to register hunter");
    return res.json();
  };

  return { getHunters, getHunter, updateHunter, deleteHunter, registerHunter };
}
