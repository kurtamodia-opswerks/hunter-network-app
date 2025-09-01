import { useAuthFetch } from "@/hooks/useAuthFetch";

export function useGuildsApi() {
  const authFetch = useAuthFetch();

  const getGuilds = async ({ search = "", ordering = "name" } = {}) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (ordering) params.append("ordering", ordering);

    const res = await authFetch(
      `http://localhost:8000/api/guilds/?${params.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to load guilds");
    return res.json();
  };

  const getGuild = async (id) => {
    const res = await authFetch(`http://localhost:8000/api/guilds/${id}/`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to load guild");
    return res.json();
  };

  const createGuild = async (data) => {
    const res = await authFetch("http://localhost:8000/api/guilds/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create guild");
    return res.json();
  };

  const updateGuild = async (id, data) => {
    const res = await authFetch(`http://localhost:8000/api/guilds/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update guild");
    return res.json();
  };

  const deleteGuild = async (id) => {
    const res = await authFetch(`http://localhost:8000/api/guilds/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete guild");
    return true;
  };

  const getGuildsByLeader = async (leaderId) => {
    const res = await authFetch(
      `http://localhost:8000/api/guilds/?leader=${leaderId}`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch leader's guild");
    return res.json();
  };

  return {
    getGuilds,
    getGuild,
    createGuild,
    updateGuild,
    deleteGuild,
    getGuildsByLeader,
  };
}
