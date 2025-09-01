// src/api/raidsApi.js
import { useAuthFetch } from "@/hooks/useAuthFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useRaidsApi() {
  const authFetch = useAuthFetch();

  // --- Raids ---
  const getRaids = async ({ search = "", ordering = "" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (ordering) params.append("ordering", ordering);

    const res = await authFetch(`${API_BASE_URL}/raids/?${params.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch raids");
    return res.json();
  };

  const getRaid = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/raids/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch raid");
    return res.json();
  };

  const createRaid = async (data) => {
    const res = await authFetch(`${API_BASE_URL}/raids/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create raid");
    return res.json();
  };

  const updateRaid = async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/raids/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update raid");
    return res.json();
  };

  const deleteRaid = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/raids/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete raid");
    return true;
  };

  // --- Raid Participations ---
  const getParticipations = async () => {
    const res = await authFetch(`${API_BASE_URL}/raid-participations/`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch participations");
    return res.json();
  };

  const createParticipation = async (data) => {
    const res = await authFetch(`${API_BASE_URL}/raid-participations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add participation");
    return res.json();
  };

  const updateParticipation = async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/raid-participations/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update participation");
    return res.json();
  };

  const deleteParticipation = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/raid-participations/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete participation");
    return true;
  };

  // --- Helpers (dungeons, hunters) ---
  const getDungeons = async () => {
    const res = await authFetch(`${API_BASE_URL}/dungeons/`);
    if (!res.ok) throw new Error("Failed to fetch dungeons");
    return res.json();
  };

  const getHunters = async () => {
    const res = await authFetch(`${API_BASE_URL}/hunters/`);
    if (!res.ok) throw new Error("Failed to fetch hunters");
    return res.json();
  };

  return {
    getRaids,
    getRaid,
    createRaid,
    updateRaid,
    deleteRaid,
    getParticipations,
    createParticipation,
    updateParticipation,
    deleteParticipation,
    getDungeons,
    getHunters,
  };
}
