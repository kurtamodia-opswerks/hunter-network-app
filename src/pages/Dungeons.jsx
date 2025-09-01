import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import DungeonCard from "@/components/dungeon/DungeonCard";
import DungeonForm from "@/components/dungeon/DungeonForm";
import { Button } from "@/components/ui/button";
import LoadingSkeleton from "@/components/LoadingSkeleton";
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
import { toast } from "sonner";
import { useDungeonsApi } from "@/api/dungeonsApi";

export default function Dungeons() {
  const { isLoggedIn, user } = useAuth();
  const { getDungeons, deleteDungeon } = useDungeonsApi();

  const [dungeons, setDungeons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDungeon, setEditingDungeon] = useState(null);
  const [creatingDungeon, setCreatingDungeon] = useState(false);
  const [deletingDungeon, setDeletingDungeon] = useState(null);

  const isAdmin = user?.is_admin || false;

  // Search and Filter state
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDungeons({ search, ordering });
        setDungeons(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, [isLoggedIn, search, ordering]);

  const handleDelete = async (id) => {
    try {
      await deleteDungeon(id);
      setDungeons((prev) => prev.filter((d) => d.id !== id));
      toast.success("Dungeon deleted successfully");
    } catch {
      toast.error("Failed to delete dungeon");
    }
    setDeletingDungeon(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="max-w-6xl mx-auto space-y-4">
          {isAdmin && (
            <Button onClick={() => setCreatingDungeon(true)}>
              + Add Dungeon
            </Button>
          )}

          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-4">
            <Input
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={ordering} onValueChange={setOrdering}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Default</SelectItem>
                <SelectItem value="name">Name ↑</SelectItem>
                <SelectItem value="-name">Name ↓</SelectItem>
                <SelectItem value="rank">Rank ↑</SelectItem>
                <SelectItem value="-rank">Rank ↓</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dungeon Grid */}
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
