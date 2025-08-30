import { useAuthFetch } from "../hooks/useAuthFetch";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SquarePen, Trash, Plus } from "lucide-react";
import DungeonForm from "@/components/DungeonForm";

// Shadcn UI
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function Dungeons() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [dungeons, setDungeons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin] = useState(() => user?.is_admin || false);
  const [editingDungeon, setEditingDungeon] = useState(null);
  const [deletingDungeon, setDeletingDungeon] = useState(null);
  const [addingDungeon, setAddingDungeon] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(0); // <-- refresh trigger

  // Fetch dungeons whenever refreshFlag changes
  useEffect(() => {
    const loadDungeons = async () => {
      setLoading(true);
      const response = await authFetch("http://localhost:8000/api/dungeons/");
      if (response.ok) {
        const data = await response.json();
        setDungeons(data);
      } else {
        console.error("Failed to load dungeons");
        toast.error("Failed to load dungeons");
      }
      setLoading(false);
    };

    if (isLoggedIn) loadDungeons();
  }, [isLoggedIn, refreshFlag]); // <-- dependency

  const handleDelete = async (dungeonId) => {
    const response = await authFetch(
      `http://localhost:8000/api/dungeons/${dungeonId}/`,
      { method: "DELETE" }
    );

    if (response.ok) {
      toast.success("Dungeon deleted successfully");
      setRefreshFlag((prev) => prev + 1); // trigger refetch
    } else {
      console.error("Failed to delete dungeon");
      toast.error("Failed to delete dungeon");
    }
    setDeletingDungeon(null);
  };

  const renderSkeleton = () =>
    Array.from({ length: 6 }).map((_, idx) => (
      <Card key={idx} className="shadow-md animate-pulse">
        <CardHeader>
          <Skeleton className="h-6 w-1/2 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ));

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          {isAdmin && (
            <div className="flex justify-end">
              <Button onClick={() => setAddingDungeon(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Dungeon
              </Button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? renderSkeleton()
              : dungeons.map((dungeon) => (
                  <Card key={dungeon.id} className="shadow-md">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{dungeon.name}</CardTitle>
                        <Badge
                          variant={
                            dungeon.rank_display === "S"
                              ? "destructive"
                              : dungeon.rank_display === "A"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {dungeon.rank_display}
                        </Badge>
                      </div>
                      <CardDescription>
                        Location: {dungeon.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 flex flex-row justify-between items-center">
                      <div className="content-div">
                        <p>
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              dungeon.is_open
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {dungeon.is_open ? "Open" : "Closed"}
                          </span>
                        </p>
                      </div>

                      {isAdmin && user && (
                        <div className="admin-buttons flex space-x-2">
                          {/* Edit Dungeon */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingDungeon(dungeon)}
                          >
                            <SquarePen />
                          </Button>

                          {/* Delete Dungeon */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeletingDungeon(dungeon)}
                              >
                                <Trash className="text-red-400" />
                              </Button>
                            </AlertDialogTrigger>

                            {deletingDungeon?.id === dungeon.id && (
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Dungeon
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete{" "}
                                    <span className="font-semibold">
                                      {dungeon.name}
                                    </span>
                                    ? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(dungeon.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            )}
                          </AlertDialog>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Edit Form */}
          {editingDungeon && (
            <DungeonForm
              dungeon={editingDungeon}
              onClose={() => setEditingDungeon(null)}
              onUpdated={() => setRefreshFlag((prev) => prev + 1)}
            />
          )}

          {/* Add Form */}
          {addingDungeon && (
            <DungeonForm
              onClose={() => setAddingDungeon(false)}
              onCreated={() => setRefreshFlag((prev) => prev + 1)}
            />
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
