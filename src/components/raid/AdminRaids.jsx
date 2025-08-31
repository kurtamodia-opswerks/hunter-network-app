import { useState, useEffect } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
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

export default function AdminRaids() {
  const authFetch = useAuthFetch();

  const [raids, setRaids] = useState([]);
  const [loadingRaids, setLoadingRaids] = useState(true);
  const [editingRaid, setEditingRaid] = useState(null);
  const [creatingRaid, setCreatingRaid] = useState(false);
  const [deletingRaid, setDeletingRaid] = useState(null);

  // Load raids
  const loadRaids = async () => {
    setLoadingRaids(true);
    try {
      const res = await authFetch("http://localhost:8000/api/raids/", {
        cache: "no-store",
      });
      if (res.ok) setRaids(await res.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load raids");
    }
    setLoadingRaids(false);
  };

  useEffect(() => {
    loadRaids();
  }, []);

  const handleDelete = async (raidId) => {
    const response = await authFetch(
      `http://localhost:8000/api/raids/${raidId}/`,
      {
        method: "DELETE",
      }
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
    <div className="space-y-4 p-4">
      <Button onClick={() => setCreatingRaid(true)}>+ Create Raid</Button>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
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

      {/* Edit Raid Modal */}
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

      {/* Create Raid Modal */}
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
