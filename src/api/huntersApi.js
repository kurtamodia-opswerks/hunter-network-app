// src/api/huntersApi.js
import { useAuthFetch } from "@/hooks/useAuthFetch";

export function useHuntersApi() {
  const authFetch = useAuthFetch();

  const getHunters = async ({ ordering, search, rank, isAdmin }) => {
    let url = `http://localhost:8000/api/hunters/?ordering=${ordering}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (!isAdmin && rank !== "all") url += `&rank=${encodeURIComponent(rank)}`;

    const res = await authFetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch hunters");
    return res.json();
  };

  const getHunter = async (id) => {
    const res = await authFetch(`http://localhost:8000/api/hunters/${id}/`);
    if (!res.ok) throw new Error("Failed to fetch hunter");
    return res.json();
  };

  const updateHunter = async (id, data) => {
    const res = await authFetch(`http://localhost:8000/api/hunters/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update hunter");
    return res.json();
  };

  const deleteHunter = async (id) => {
    const res = await authFetch(`http://localhost:8000/api/hunters/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete hunter");
    return true;
  };

  // ✅ New: register a hunter
  const registerHunter = async (data) => {
    const res = await fetch("http://localhost:8000/api/hunters/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to register hunter");
    return res.json();
  };

  return { getHunters, getHunter, updateHunter, deleteHunter, registerHunter };
}
