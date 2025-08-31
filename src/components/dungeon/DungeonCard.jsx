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

export default function DungeonCard({
  dungeon,
  isAdmin,
  onEdit,
  onDelete,
  deletingDungeon,
  setDeletingDungeon,
}) {
  return (
    <Card className="shadow-md">
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
        <CardDescription>Location: {dungeon.location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-row justify-between items-center">
        <p>
          Status:{" "}
          <span
            className={`font-medium ${
              dungeon.is_open ? "text-green-600" : "text-red-600"
            }`}
          >
            {dungeon.is_open ? "Open" : "Closed"}
          </span>
        </p>

        {isAdmin && (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(dungeon)}>
              <SquarePen />
            </Button>

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
                    <AlertDialogTitle>Delete Dungeon</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete{" "}
                      <span className="font-semibold">{dungeon.name}</span>?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(dungeon.id)}
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
