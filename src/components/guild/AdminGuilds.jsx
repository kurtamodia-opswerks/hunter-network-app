// src/components/AdminGuilds.jsx
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useEffect, useState } from "react";
import GuildCard from "@/components/guild/GuildCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import GuildForm from "@/components/guild/GuildForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AdminGuilds() {
  const authFetch = useAuthFetch();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGuild, setEditingGuild] = useState(null);
  const [creatingGuild, setCreatingGuild] = useState(false);
  const [deletingGuild, setDeletingGuild] = useState(null);

  // Search & ordering
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");

  const loadGuilds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search); // DRF search param
      if (ordering) params.append("ordering", ordering); // DRF ordering param

      const response = await authFetch(
        `http://localhost:8000/api/guilds/?${params.toString()}`,
        { cache: "no-store" }
      );
      if (response.ok) {
        const data = await response.json();
        setGuilds(data);
      } else {
        toast.error("Failed to load guilds");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching guilds");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGuilds();
  }, [search, ordering]);

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
    <div className="space-y-4 max-w-6xl mx-auto">
      <Button onClick={() => setCreatingGuild(true)}>+ Create Guild</Button>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={ordering} onValueChange={setOrdering}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name ↑</SelectItem>
            <SelectItem value="-name">Name ↓</SelectItem>
            <SelectItem value="founded_date">Founded ↑</SelectItem>
            <SelectItem value="-founded_date">Founded ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guild Grid */}
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

      {/* Edit Guild Modal */}
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

      {/* Create Guild Modal */}
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
