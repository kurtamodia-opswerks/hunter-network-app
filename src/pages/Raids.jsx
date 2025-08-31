import { useAuthFetch } from "../hooks/useAuthFetch";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import RaidCard from "@/components/RaidCard";
import RaidForm from "@/components/RaidForm";
import LoadingSkeleton from "@/components/LoadingSkeleton"; // <-- new
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Raids() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [raids, setRaids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRaid, setEditingRaid] = useState(null);
  const [creatingRaid, setCreatingRaid] = useState(false);
  const [deletingRaid, setDeletingRaid] = useState(null);

  const isAdmin = user?.is_admin || false;

  // Fetch raids
  const loadRaids = async () => {
    setLoading(true);
    try {
      const response = await authFetch("http://localhost:8000/api/raids/", {
        cache: "no-store",
      });
      if (response.ok) {
        setRaids(await response.json());
      } else {
        console.error("Failed to load raids");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) loadRaids();
  }, [isLoggedIn]);

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
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          {isAdmin && (
            <Button onClick={() => setCreatingRaid(true)}>+ Create Raid</Button>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <LoadingSkeleton key={idx} />
                ))
              : raids.map((raid) => (
                  <RaidCard
                    key={raid.id}
                    raid={raid}
                    isAdmin={isAdmin}
                    onEdit={setEditingRaid}
                    onDelete={handleDelete}
                    deletingRaid={deletingRaid}
                    setDeletingRaid={setDeletingRaid}
                  />
                ))}
          </div>

          {/* Edit Raid Modal */}
          {editingRaid && (
            <Dialog
              open={!!editingRaid}
              onOpenChange={() => setEditingRaid(null)}
            >
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
            <Dialog
              open={creatingRaid}
              onOpenChange={() => setCreatingRaid(false)}
            >
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
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
          <p className="text-lg">Please log in to view the Raids section.</p>
        </div>
      )}
    </>
  );
}
