import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SquarePen, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function HunterCard({
  hunter,
  isAdmin,
  onEdit,
  onDelete,
  deletingHunter,
  setDeletingHunter,
}) {
  const authFetch = useAuthFetch();
  const [skillMap, setSkillMap] = useState({});

  // Fetch all skills and create a mapping from ID to name
  useEffect(() => {
    const fetchSkills = async () => {
      const res = await authFetch("http://localhost:8000/api/skills/");
      if (res.ok) {
        const skills = await res.json();
        const map = {};
        skills.forEach((s) => {
          map[s.id] = s.name;
        });
        setSkillMap(map);
      }
    };
    fetchSkills();
  }, []);

  // Convert hunter's skill IDs to names
  const skillNames =
    hunter.skills && hunter.skills.length > 0
      ? hunter.skills.map((id) => skillMap[id] || `Skill ${id}`).join(", ")
      : "None";

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <CardTitle>{hunter.full_name}</CardTitle>
          {hunter.guild_name && <Badge>{hunter.guild_name}</Badge>}
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

      <CardContent className="space-y-2">
        {isAdmin && (
          <div className="grid grid-cols-2 gap-4">
            <p>
              <span className="font-semibold">Username:</span> {hunter.username}
            </p>
            <p>
              <span className="font-semibold">Date Joined:</span>{" "}
              {hunter.date_joined}
            </p>
            <p>
              <span className="font-semibold">Power Level:</span>{" "}
              {hunter.power_level}
            </p>
            <p>
              <span className="font-semibold">Raid Count:</span>{" "}
              {hunter.raid_count}
            </p>
            <div className="col-span-2">
              <span className="font-semibold">Skills:</span> {skillNames}
            </div>
          </div>
        )}

        {!isAdmin && (
          <div className="flex flex-row justify-between items-center">
            <p>
              Power Level:{" "}
              <span className="font-medium">{hunter.power_level}</span>
            </p>
            <p>
              Raid Count:{" "}
              <span className="font-medium">{hunter.raid_count}</span>
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="admin-buttons flex space-x-2 mt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(hunter)}>
              <SquarePen />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingHunter(hunter)}
                >
                  <Trash className="text-red-400" />
                </Button>
              </AlertDialogTrigger>

              {deletingHunter?.id === hunter.id && (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Hunter</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete{" "}
                      <span className="font-semibold">{hunter.full_name}</span>?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(hunter.id)}
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
  );
}
