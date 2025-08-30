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
import { SquarePen, Trash } from "lucide-react";
import EditRaidForm from "@/components/EditRaidForm"; // create later

// shadcn/ui imports for delete confirmation
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

export default function Raids() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [raids, setRaids] = useState([]);
  const [editingRaid, setEditingRaid] = useState(null);
  const [deletingRaid, setDeletingRaid] = useState(null);
  const [isAdmin, setIsAdmin] = useState(() => user?.is_admin || false);

  // Load raids from API
  useEffect(() => {
    const loadRaids = async () => {
      const response = await authFetch("http://localhost:8000/api/raids/");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched raids:", data);
        setRaids(data);
      } else {
        console.error("Failed to load raids");
      }
    };

    if (isLoggedIn) loadRaids();
  }, [isLoggedIn]);

  const handleDelete = async (raidId) => {
    const response = await authFetch(
      `http://localhost:8000/api/raids/${raidId}/`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      setRaids((prev) => prev.filter((r) => r.id !== raidId));
    } else {
      console.error("Failed to delete raid");
    }
    setDeletingRaid(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {raids.map((raid) => (
              <Card key={raid.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{raid.name}</CardTitle>
                    <Badge
                      variant={
                        raid.dungeon_info.rank === "S"
                          ? "destructive"
                          : "outline"
                      }
                    >
                      {raid.dungeon_info.rank}
                    </Badge>
                  </div>
                  <CardDescription>{raid.date}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-2 flex flex-col justify-between">
                  <p>
                    Dungeon:{" "}
                    <span className="font-medium">
                      {raid.dungeon_info.name}
                    </span>
                  </p>
                  <p>
                    Team Strength:{" "}
                    <span className="font-medium">{raid.team_strength}</span>
                  </p>
                  <p>Participations Info:</p>
                  <ul className="list-disc ml-5">
                    {Array.isArray(raid.participations_info) &&
                      raid.participations_info.map((h) => (
                        <li key={h.id}>
                          {h.full_name} ({h.hunter_rank} - {h.role})
                        </li>
                      ))}
                  </ul>

                  <p>
                    Success:{" "}
                    {raid.success ? (
                      <Badge variant="success">Yes</Badge>
                    ) : (
                      <Badge variant="destructive">No</Badge>
                    )}
                  </p>

                  {isAdmin && (
                    <div className="flex space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRaid(raid)}
                      >
                        <SquarePen />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingRaid(raid)}
                          >
                            <Trash className="text-red-400" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Raid</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <span className="font-semibold">{raid.name}</span>
                              ? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(raid.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {editingRaid && (
              <EditRaidForm
                raid={editingRaid}
                onClose={() => setEditingRaid(null)}
                onUpdated={(updated) => {
                  setRaids((prev) =>
                    prev.map((r) => (r.id === updated.id ? updated : r))
                  );
                }}
              />
            )}
          </div>
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
