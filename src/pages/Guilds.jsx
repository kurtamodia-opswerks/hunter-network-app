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
import EditGuildForm from "@/components/EditGuildForm";
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

export default function Guilds() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [guilds, setGuilds] = useState([]);
  const [isAdmin, setIsAdmin] = useState(() => user?.is_admin || false);
  const [editingGuild, setEditingGuild] = useState(null);
  const [deletingGuild, setDeletingGuild] = useState(null);

  useEffect(() => {
    const loadGuilds = async () => {
      const response = await authFetch("http://localhost:8000/api/guilds/");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched guilds:", data);
        setGuilds(data);
      } else {
        console.error("Failed to load guilds");
      }
    };
    if (isLoggedIn) loadGuilds();
  }, [isLoggedIn]);

  const handleDelete = async (guildId) => {
    const response = await authFetch(
      `http://localhost:8000/api/guilds/${guildId}/`,
      { method: "DELETE" }
    );

    if (response.ok) {
      setGuilds((prev) => prev.filter((g) => g.id !== guildId));
    } else {
      console.error("Failed to delete guild");
    }
    setDeletingGuild(null);
  };

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guilds.map((guild) => (
              <Card key={guild.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{guild.name}</CardTitle>
                    <Badge>{guild.member_count} members</Badge>
                  </div>
                  <CardDescription>
                    Founded: {guild.founded_date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex flex-col">
                  <p>
                    Leader:{" "}
                    <span className="font-medium">
                      {guild.leader_display?.full_name || "Unassigned"}
                    </span>{" "}
                    ({guild.leader_display?.rank_display})
                  </p>
                  <p className="text-sm font-medium">Members:</p>
                  <ul className="list-disc ml-5">
                    {guild.members.map((m) => (
                      <li key={m.id}>
                        {m.full_name} ({m.rank_display})
                      </li>
                    ))}
                  </ul>

                  {isAdmin && user && (
                    <div className="flex space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingGuild(guild)}
                      >
                        <SquarePen />
                      </Button>

                      {/* Delete Confirmation Modal */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeletingGuild(guild)}
                          >
                            <Trash className="text-red-400" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Guild</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <span className="font-semibold">
                                {guild.name}
                              </span>
                              ? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(guild.id)}
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

            {editingGuild && (
              <EditGuildForm
                guild={editingGuild}
                onClose={() => setEditingGuild(null)}
                onUpdated={(updated) => {
                  setGuilds((prev) =>
                    prev.map((g) => (g.id === updated.id ? updated : g))
                  );
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
          <p className="text-lg">Please log in to view the Guilds section.</p>
        </div>
      )}
    </>
  );
}
