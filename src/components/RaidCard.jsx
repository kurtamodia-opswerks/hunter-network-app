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

export default function RaidCard({
  raid,
  isAdmin,
  onEdit,
  onDelete,
  deletingRaid,
  setDeletingRaid,
}) {
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
        <p className="text-sm font-medium">Participations:</p>
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
          <div className="flex space-x-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => onEdit(raid)}>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
