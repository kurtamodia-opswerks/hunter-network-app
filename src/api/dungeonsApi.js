// src/api/dungeonsApi.js
import { useAuthFetch } from "@/hooks/useAuthFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useDungeonsApi() {
  const authFetch = useAuthFetch();

  const getDungeons = async ({ search, ordering }) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (ordering) params.append("ordering", ordering);

    const res = await authFetch(
      `${API_BASE_URL}/dungeons/?${params.toString()}`
    );
    if (!res.ok) throw new Error("Failed to fetch dungeons");
    return res.json();
  };

  const getDungeon = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/dungeons/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch dungeon");
    return res.json();
  };

  const createDungeon = async (data) => {
    const res = await authFetch(`${API_BASE_URL}/dungeons/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create dungeon");
    return res.json();
  };

  const updateDungeon = async (id, data) => {
    const res = await authFetch(`${API_BASE_URL}/dungeons/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update dungeon");
    return res.json();
  };

  const deleteDungeon = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/dungeons/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete dungeon");
    return true;
  };

  return {
    getDungeons,
    getDungeon,
    createDungeon,
    updateDungeon,
    deleteDungeon,
  };
}
