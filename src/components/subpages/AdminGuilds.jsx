// src/components/AdminGuilds.jsx
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useEffect, useState } from "react";
import GuildCard from "@/components/GuildCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import GuildForm from "@/components/GuildForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminGuilds() {
  const authFetch = useAuthFetch();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGuild, setEditingGuild] = useState(null);
  const [creatingGuild, setCreatingGuild] = useState(false);
  const [deletingGuild, setDeletingGuild] = useState(null);

  // Fetch guilds
  const loadGuilds = async () => {
    setLoading(true);
    try {
      const response = await authFetch("http://localhost:8000/api/guilds/", {
        cache: "no-store",
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
    loadGuilds();
  }, []);

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
    <div className="space-y-4">
      <Button onClick={() => setCreatingGuild(true)}>+ Create Guild</Button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))
          : guilds.map((guild) => (
              <GuildCard
                key={guild.id}
                guild={guild}
                isAdmin={true}
                onEdit={setEditingGuild}
                onDelete={handleDelete}
                deletingGuild={deletingGuild}
                setDeletingGuild={setDeletingGuild}
              />
            ))}
      </div>

      {/* Edit guild modal */}
      {editingGuild && (
        <Dialog
          open={!!editingGuild}
          onOpenChange={() => setEditingGuild(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Guild</DialogTitle>
            </DialogHeader>
            <GuildForm
              mode="edit"
              guild={editingGuild}
              onClose={() => setEditingGuild(null)}
              onSaved={(updated) =>
                setGuilds((prev) =>
                  prev.map((g) => (g.id === updated.id ? updated : g))
                )
              }
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Create guild modal */}
      {creatingGuild && (
        <Dialog
          open={creatingGuild}
          onOpenChange={() => setCreatingGuild(false)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Guild</DialogTitle>
            </DialogHeader>
            <GuildForm
              mode="create"
              onClose={() => setCreatingGuild(false)}
              onSaved={(newGuild) => setGuilds((prev) => [...prev, newGuild])}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
