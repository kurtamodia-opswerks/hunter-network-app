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

export default function HunterCard({
  hunter,
  isAdmin,
  onEdit,
  onDelete,
  deletingHunter,
  setDeletingHunter,
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{hunter.full_name}</CardTitle>
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
          <p>
            Power Level:{" "}
            <span className="font-medium">{hunter.power_level}</span>
          </p>
          <p>
            Raid Count: <span className="font-medium">{hunter.raid_count}</span>
          </p>
        </div>

        {isAdmin && (
          <div className="admin-buttons flex space-x-2">
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
