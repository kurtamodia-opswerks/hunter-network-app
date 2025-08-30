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
import EditHunterForm from "@/components/EditHunterForm";

export default function Hunters() {
  const authFetch = useAuthFetch();
  const [hunters, setHunters] = useState([]);
  const { isLoggedIn, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(() => user?.is_admin || false);
  const [editingHunter, setEditingHunter] = useState(null);

  useEffect(() => {
    const loadHunters = async () => {
      const response = await authFetch("http://localhost:8000/api/hunters/");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched hunters:", data);
        setHunters(data);
      } else {
        console.error("Failed to load hunters");
      }
    };
    if (isLoggedIn) loadHunters();
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          {/* <Button onClick={loadHunters}>Load Hunters</Button> */}

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hunters.map((hunter) => (
              <Card key={hunter.id} className="shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{hunter.full_name} </CardTitle>
                    {/* Badge for rank */}
                    {hunter.guild && <Badge>{hunter.guild_name}</Badge>}
                    <Badge
                      variant={
                        hunter.rank === "S"
                          ? "destructive"
                          : hunter.rank === "A"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {hunter.rank_display}
                    </Badge>
                  </div>
                  <CardDescription>{hunter.email}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 flex flex-row justify-between items-center">
                  <div className="content-div">
                    {" "}
                    <p>
                      Power Level:{" "}
                      <span className="font-medium">{hunter.power_level}</span>
                    </p>
                    <p>
                      Raid Count:{" "}
                      <span className="font-medium">{hunter.raid_count}</span>
                    </p>
                  </div>
                  {/* Edit and Delete buttons */}
                  {isAdmin && user && (
                    <div className="admin-buttons flex space-x-2">
                      {" "}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingHunter(hunter)}
                      >
                        <SquarePen />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash className="text-red-400" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {editingHunter && (
              <EditHunterForm
                hunter={editingHunter}
                onClose={() => setEditingHunter(null)}
                onUpdated={(updated) => {
                  setHunters((prev) =>
                    prev.map((h) => (h.id === updated.id ? updated : h))
                  );
                }}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
          <p className="text-lg">Please log in to view the Hunters section.</p>
        </div>
      )}
    </>
  );
}
