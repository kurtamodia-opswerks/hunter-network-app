import { useState } from "react";
import GuildCard from "@/components/guild/GuildCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import GuildForm from "@/components/guild/admin/GuildForm";
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
import { useGuildsApi } from "@/api/guildsApi";

export default function AdminGuilds({
  guilds,
  setGuilds,
  loading,
  search,
  setSearch,
  ordering,
  setOrdering,
}) {
  const { deleteGuild } = useGuildsApi();

  const [editingGuildId, setEditingGuildId] = useState(null);
  const [isCreatingGuild, setIsCreatingGuild] = useState(false);
  const [deletingGuildId, setDeletingGuildId] = useState(null);

  const handleDelete = async (guildId) => {
    try {
      await deleteGuild(guildId);
      setGuilds((prev) => prev.filter((g) => g.id !== guildId));
      toast.success("Guild deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete guild");
    }
    setDeletingGuildId(null); // Fixed: was setDeletingGuild
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto">
      <Button onClick={() => setIsCreatingGuild(true)}>+ Create Guild</Button>

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

      {/* Guilds Grid */}
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
                onEdit={setEditingGuildId}
                onDelete={handleDelete}
                deletingGuildId={deletingGuildId} // Fixed: was deletingGuild
                setDeletingGuildId={setDeletingGuildId} // Fixed: was setDeletingGuild
              />
            ))}
      </div>

      {/* Edit Guild Modal */}
      {editingGuildId && (
        <Dialog
          open={!!editingGuildId}
          onOpenChange={() => setEditingGuildId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Guild</DialogTitle>
            </DialogHeader>
            <GuildForm
              mode="edit"
              guild={editingGuildId}
              onClose={() => setEditingGuildId(null)}
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
      {isCreatingGuild && ( // Fixed: was creatingGuild
        <Dialog
          open={isCreatingGuild} // Fixed: was creatingGuild
          onOpenChange={() => setIsCreatingGuild(false)} // Fixed: was setCreatingGuild
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Guild</DialogTitle>
            </DialogHeader>
            <GuildForm
              mode="create"
              onClose={() => setIsCreatingGuild(false)} // Fixed: was setCreatingGuild
              onSaved={(newGuild) => setGuilds((prev) => [...prev, newGuild])}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
