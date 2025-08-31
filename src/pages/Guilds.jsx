import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import AdminGuilds from "@/components/guild/AdminGuilds";
import UserGuilds from "@/components/guild/UserGuilds";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function Guilds() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.is_admin || false;
  const authFetch = useAuthFetch();

  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("name");

  const loadGuilds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (ordering) params.append("ordering", ordering);

      const response = await authFetch(
        `http://localhost:8000/api/guilds/?${params.toString()}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = await response.json();
        setGuilds(data);
      } else {
        console.error("Failed to load guilds");
      }
    } catch (err) {
      console.error(err);
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
