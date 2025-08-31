import { useAuthFetch } from "../hooks/useAuthFetch";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import DungeonCard from "@/components/DungeonCard";
import DungeonForm from "@/components/DungeonForm";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function Dungeons() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [dungeons, setDungeons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDungeon, setEditingDungeon] = useState(null);
  const [creatingDungeon, setCreatingDungeon] = useState(false);
  const [deletingDungeon, setDeletingDungeon] = useState(null);

  const isAdmin = user?.is_admin || false;

  const loadDungeons = async () => {
    setLoading(true);
    try {
      const response = await authFetch("http://localhost:8000/api/dungeons/");
      if (response.ok) {
        const data = await response.json();
        setDungeons(data);
      } else {
        console.error("Failed to load dungeons");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isLoggedIn) loadDungeons();
  }, [isLoggedIn]);

  const handleDelete = async (id) => {
    const response = await authFetch(
      `http://localhost:8000/api/dungeons/${id}/`,
      { method: "DELETE" }
    );
    if (response.ok) {
      setDungeons((prev) => prev.filter((d) => d.id !== id));
      toast.success("Dungeon deleted successfully");
    } else {
      toast.error("Failed to delete dungeon");
    }
    setDeletingDungeon(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          {isAdmin && (
            <Button onClick={() => setCreatingDungeon(true)}>
              + Add Dungeon
            </Button>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <LoadingSkeleton key={idx} />
                ))
              : dungeons.map((d) => (
                  <DungeonCard
                    key={d.id}
                    dungeon={d}
                    isAdmin={isAdmin}
                    onEdit={setEditingDungeon}
                    onDelete={handleDelete}
                    deletingDungeon={deletingDungeon}
                    setDeletingDungeon={setDeletingDungeon}
                  />
                ))}
          </div>

          {/* Edit dungeon modal */}
          {editingDungeon && (
            <Dialog
              open={!!editingDungeon}
              onOpenChange={() => setEditingDungeon(null)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Dungeon</DialogTitle>
                </DialogHeader>
                <DungeonForm
                  mode="edit"
                  dungeon={editingDungeon}
                  onClose={() => setEditingDungeon(null)}
                  onSaved={(updated) =>
                    setDungeons((prev) =>
                      prev.map((d) => (d.id === updated.id ? updated : d))
                    )
                  }
                />
              </DialogContent>
            </Dialog>
          )}

          {/* Create dungeon modal */}
          {creatingDungeon && (
            <Dialog
              open={creatingDungeon}
              onOpenChange={() => setCreatingDungeon(false)}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Dungeon</DialogTitle>
                </DialogHeader>
                <DungeonForm
                  mode="create"
                  onClose={() => setCreatingDungeon(false)}
                  onSaved={(newDungeon) =>
                    setDungeons((prev) => [...prev, newDungeon])
                  }
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
          <p className="text-lg">Please log in to view the Dungeons section.</p>
        </div>
      )}
    </>
  );
}
