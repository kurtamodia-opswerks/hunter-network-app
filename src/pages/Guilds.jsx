// src/pages/Guilds.jsx
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import AdminGuilds from "@/components/guild/admin/AdminGuilds";
import UserGuilds from "@/components/guild/non-admin/UserGuilds";
import { useGuildsApi } from "@/api/guildsApi";

export default function Guilds() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.is_admin || false;

  const { getGuilds } = useGuildsApi();

  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("name");

  const loadGuilds = async () => {
    setLoading(true);
    try {
      const data = await getGuilds({ search, ordering });
      setGuilds(data);
    } catch (err) {
      console.error("Failed to load guilds", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGuilds();
  }, [search, ordering]);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
        <p className="text-lg">Please log in to view the Guilds section.</p>
      </div>
    );
  }

  return isAdmin ? (
    <AdminGuilds
      guilds={guilds}
      setGuilds={setGuilds}
      loading={loading}
      search={search}
      setSearch={setSearch}
      ordering={ordering}
      setOrdering={setOrdering}
    />
  ) : (
    <UserGuilds
      guilds={guilds}
      loading={loading}
      search={search}
      setSearch={setSearch}
      ordering={ordering}
      setOrdering={setOrdering}
      userId={user.user_id}
      isAdmin={isAdmin}
    />
  );
}
