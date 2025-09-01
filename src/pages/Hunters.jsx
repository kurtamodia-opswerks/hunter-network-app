// Hunters.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AdminHunters from "@/components/hunter/admin/AdminHunters";
import UserHunters from "@/components/hunter/non-admin/UserHunters";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useFetchSkillsAndGuilds } from "@/hooks/useFetchSkillsAndGuilds";

export default function Hunters() {
  const { user, isLoggedIn } = useAuth();
  const isAdmin = user?.is_admin || false;
  const authFetch = useAuthFetch();
  const { skills, guilds } = useFetchSkillsAndGuilds();

  // Shared state
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState(
    isAdmin ? "first_name" : "-power_level"
  );
  const [rank, setRank] = useState("all");

  // Fetch hunters
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadHunters = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:8000/api/hunters/?ordering=${ordering}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (!isAdmin && rank !== "all")
          url += `&rank=${encodeURIComponent(rank)}`;

        const res = await authFetch(url, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setHunters(data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    loadHunters();
  }, [search, ordering, rank, isAdmin, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
        <p className="text-lg">Please log in to view the Hunters section.</p>
      </div>
    );
  }

  return isAdmin ? (
    <AdminHunters
      hunters={hunters}
      setHunters={setHunters}
      loading={loading}
      search={search}
      setSearch={setSearch}
      ordering={ordering}
      setOrdering={setOrdering}
      skills={skills}
      guilds={guilds}
    />
  ) : (
    <UserHunters
      hunters={hunters}
      loading={loading}
      search={search}
      setSearch={setSearch}
      rank={rank}
      setRank={setRank}
      skills={skills}
      guilds={guilds}
    />
  );
}
