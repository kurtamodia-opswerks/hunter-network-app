import { useState } from "react";
import { toast } from "sonner";

import RaidCard from "@/components/raid/RaidCard";
import RaidForm from "@/components/raid/RaidForm";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function AdminRaids({
  raids,
  setRaids,
  loadingRaids,
  search,
  setSearch,
  ordering,
  setOrdering,
  authFetch,
}) {
  const [editingRaid, setEditingRaid] = useState(null);
  const [creatingRaid, setCreatingRaid] = useState(false);
  const [deletingRaid, setDeletingRaid] = useState(null);

  const handleDelete = async (raidId) => {
    const response = await authFetch(
      `http://localhost:8000/api/raids/${raidId}/`,
      { method: "DELETE" }
    );
    if (response.ok) {
      setRaids((prev) => prev.filter((r) => r.id !== raidId));
      toast.success("Raid deleted successfully");
    } else {
      toast.error("Failed to delete raid");
    }
    setDeletingRaid(null);
  };

  return (
    <div className="space-y-4 p-4 max-w-6xl mx-auto">
      <Button onClick={() => setCreatingRaid(true)}>+ Create Raid</Button>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-4">
        <Input
          placeholder="Search by raid name..."
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
            <SelectItem value="date">Date ↑</SelectItem>
            <SelectItem value="-date">Date ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Raid Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loadingRaids
          ? Array.from({ length: 6 }).map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))
          : raids.map((raid) => (
              <RaidCard
                key={raid.id}
                raid={raid}
                isAdmin={true}
                onEdit={setEditingRaid}
                onDelete={handleDelete}
                setDeletingRaid={setDeletingRaid}
              />
            ))}
      </div>

      {/* Modals */}
      {editingRaid && (
        <Dialog open={!!editingRaid} onOpenChange={() => setEditingRaid(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Raid</DialogTitle>
            </DialogHeader>
            <RaidForm
              mode="edit"
              raid={editingRaid}
              onClose={() => setEditingRaid(null)}
              onSaved={(updated) =>
                setRaids((prev) =>
                  prev.map((r) => (r.id === updated.id ? updated : r))
                )
              }
            />
          </DialogContent>
        </Dialog>
      )}
      {creatingRaid && (
        <Dialog open={creatingRaid} onOpenChange={() => setCreatingRaid(false)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Raid</DialogTitle>
            </DialogHeader>
            <RaidForm
              mode="create"
              onClose={() => setCreatingRaid(false)}
              onSaved={(newRaid) => setRaids((prev) => [...prev, newRaid])}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
