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

export default function GuildCard({
  guild,
  isAdmin,
  onEdit,
  onDelete,
  deletingGuild,
  setDeletingGuild,
}) {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{guild.name}</CardTitle>
          <Badge>{guild.member_count} members</Badge>
        </div>
        <CardDescription>Founded: {guild.founded_date}</CardDescription>
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

        {isAdmin && (
          <div className="flex space-x-2 mt-3">
            <Button variant="outline" size="sm" onClick={() => onEdit(guild)}>
              <SquarePen />
            </Button>

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
                    <span className="font-semibold">{guild.name}</span>? This
                    action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(guild.id)}
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
