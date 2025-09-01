// components/raid/RaidActions.jsx
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

export default function RaidActions({
  raid,
  isAdmin,
  userParticipation,
  loadingAction,
  onEdit,
  onDelete,
  setDeletingRaid,
  handleJoinRaid,
  handleLeaveRaid,
}) {
  if (isAdmin) {
    return (
      <>
        <Button variant="outline" size="sm" onClick={() => onEdit(raid)}>
          <SquarePen className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeletingRaid(raid)}
            >
              <Trash className="h-4 w-4 " />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Raid</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{raid.name}</span>? This action
                cannot be undone.
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
    );
  }

  return userParticipation ? (
    <Button
      size="sm"
      variant="destructive"
      onClick={handleLeaveRaid}
      disabled={loadingAction}
    >
      {loadingAction ? "Leaving..." : "Leave Raid"}
    </Button>
  ) : (
    <Button size="sm" onClick={handleJoinRaid} disabled={loadingAction}>
      {loadingAction ? "Joining..." : "Join Raid"}
    </Button>
  );
}
