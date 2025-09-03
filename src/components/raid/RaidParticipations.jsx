// components/raid/RaidParticipations.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Users, Plus, SquarePen, Trash } from "lucide-react";
import RaidParticipationForm from "./admin/RaidParticipationForm";
import { useRaidsApi } from "@/api/raidsApi";
import { toast } from "sonner";
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

export default function RaidParticipations({
  participations,
  setParticipations,
  raidId,
  isAdmin,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipation, setEditingParticipation] = useState(null);
  const [deletingParticipation, setDeletingParticipation] = useState(null);

  const { deleteParticipation } = useRaidsApi();

  const handleDelete = async (id) => {
    try {
      await deleteParticipation(id);
      setParticipations((prev) => prev.filter((p) => p.id !== id));
      toast.success("Participation deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting participation");
    } finally {
      setDeletingParticipation(null);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Users className="mr-2 h-4 w-4" />
          Participations
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] p-4">
        <SheetHeader>
          <SheetTitle>Participations</SheetTitle>
        </SheetHeader>

        {!showAddForm && !editingParticipation ? (
          <>
            <ul className="mt-4 space-y-2">
              {participations.map((h) => (
                <li
                  key={h.id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <span>
                    {h.full_name} ({h.hunter_rank} - {h.role})
                  </span>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditingParticipation(h)}
                      >
                        <SquarePen className="h-4 w-4" />
                      </Button>

                      {/* Delete Confirmation Modal */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => setDeletingParticipation(h)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Participation
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove{" "}
                              <strong>{h.full_name}</strong> from this raid?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(h.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {isAdmin && (
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Participation
              </Button>
            )}
          </>
        ) : (
          <RaidParticipationForm
            raidId={raidId}
            participation={editingParticipation}
            participations={participations}
            onClose={() => {
              setShowAddForm(false);
              setEditingParticipation(null);
            }}
            onAdded={(newP) => setParticipations((prev) => [...prev, newP])}
            onUpdated={(updatedP) =>
              setParticipations((prev) =>
                prev.map((p) => (p.id === updatedP.id ? updatedP : p))
              )
            }
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
