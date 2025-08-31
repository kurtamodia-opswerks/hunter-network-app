import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SquarePen, Trash, Users, Plus } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import RaidParticipationForm from "./RaidParticipationForm";
import { useAuth } from "@/context/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";

export default function RaidCard({
  raid,
  isAdmin,
  onEdit,
  onDelete,
  setDeletingRaid,
}) {
  const { user } = useAuth();
  const authFetch = useAuthFetch();

  const [participations, setParticipations] = useState(
    raid.participations_info || []
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [joining, setJoining] = useState(false);

  const handleJoinRaid = async () => {
    if (!user) return toast.error("You must be logged in to join a raid.");
    console.log("Joining raid:", raid.id);
    console.log("User:", user.user_id);

    setJoining(true);
    try {
      const response = await authFetch(
        "http://localhost:8000/api/raid-participations/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            raid: raid.id,
            hunter: user.user_id,
            role: "DPS",
          }),
        }
      );

      if (response.ok) {
        const newParticipation = await response.json();
        setParticipations((prev) => [...prev, newParticipation]);
        toast.success("You joined the raid!");
      } else if (response.status === 400) {
        toast.error("You have already joined this raid.");
      } else {
        toast.error("Failed to join the raid.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while joining.");
    }
    setJoining(false);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{raid.name}</CardTitle>
          <Badge
            variant={raid.dungeon_info.rank === "S" ? "destructive" : "outline"}
          >
            {raid.dungeon_info.rank}
          </Badge>
        </div>
        <CardDescription>{raid.date}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-2 flex flex-col">
        <p>
          Dungeon: <span className="font-medium">{raid.dungeon_info.name}</span>
        </p>
        <p>
          Team Strength:{" "}
          <span className="font-medium">{raid.team_strength}</span>
        </p>

        <p>
          Success:{" "}
          {raid.success ? (
            <Badge variant="success">Yes</Badge>
          ) : (
            <Badge variant="destructive">No</Badge>
          )}
        </p>

        <div className="flex space-x-2 mt-3">
          {/* View Participations */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="mr-2 h-4 w-4" />
                Participations
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px]">
              <SheetHeader>
                <SheetTitle>Participations</SheetTitle>
              </SheetHeader>

              {!showAddForm ? (
                <>
                  <ul className="list-disc ml-5 mt-4 space-y-2">
                    {participations.map((h) => (
                      <li key={h.id}>
                        {h.full_name} ({h.hunter_rank} - {h.role})
                      </li>
                    ))}
                  </ul>
                  {isAdmin && (
                    <Button
                      className="mt-4"
                      onClick={() => setShowAddForm(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Participation
                    </Button>
                  )}
                </>
              ) : (
                <RaidParticipationForm
                  raidId={raid.id}
                  onClose={() => setShowAddForm(false)}
                  onAdded={(newP) =>
                    setParticipations((prev) => [...prev, newP])
                  }
                />
              )}
            </SheetContent>
          </Sheet>

          {/* Admin actions OR Join button */}
          {isAdmin ? (
            <>
              {/* Edit */}
              <Button variant="outline" size="sm" onClick={() => onEdit(raid)}>
                <SquarePen className="mr-2 h-4 w-4" />
                Edit
              </Button>

              {/* Delete */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingRaid(raid)}
                  >
                    <Trash className="mr-2 h-4 w-4 text-red-400" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Raid</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete{" "}
                      <span className="font-semibold">{raid.name}</span>? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(raid.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button size="sm" onClick={handleJoinRaid} disabled={joining}>
              {joining ? "Joining..." : "Join Raid"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
