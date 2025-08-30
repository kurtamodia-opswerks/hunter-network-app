import { useAuthFetch } from "../hooks/useAuthFetch";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import GuildCard from "@/components/GuildCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EditGuildForm from "@/components/EditGuildForm";
import { toast } from "sonner";

export default function Guilds() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGuild, setEditingGuild] = useState(null);
  const [deletingGuild, setDeletingGuild] = useState(null);

  const isAdmin = user?.is_admin || false;

  // Fetch guilds
  const loadGuilds = async () => {
    setLoading(true);
    try {
      const response = await authFetch("http://localhost:8000/api/guilds/", {
        cache: "no-store", // disable caching
      });
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
    if (isLoggedIn) loadGuilds();
  }, [isLoggedIn]);

  const handleDelete = async (guildId) => {
    const response = await authFetch(
      `http://localhost:8000/api/guilds/${guildId}/`,
      { method: "DELETE" }
    );
    if (response.ok) {
      setGuilds((prev) => prev.filter((g) => g.id !== guildId));
      toast.success("Guild deleted successfully");
    } else {
      toast.error("Failed to delete guild");
    }
    setDeletingGuild(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <LoadingSkeleton key={idx} />
                ))
              : guilds.map((guild) => (
                  <GuildCard
                    key={guild.id}
                    guild={guild}
                    isAdmin={isAdmin}
                    onEdit={setEditingGuild}
                    onDelete={handleDelete}
                    deletingGuild={deletingGuild}
                    setDeletingGuild={setDeletingGuild}
                  />
                ))}
          </div>

          {editingGuild && (
            <EditGuildForm
              guild={editingGuild}
              onClose={() => setEditingGuild(null)}
              onUpdated={(updated) =>
                setGuilds((prev) =>
                  prev.map((g) => (g.id === updated.id ? updated : g))
                )
              }
            />
          )}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
          <p className="text-lg">Please log in to view the Guilds section.</p>
        </div>
      )}
    </>
  );
}
