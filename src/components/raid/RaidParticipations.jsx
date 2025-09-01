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

export default function RaidParticipations({
  participations,
  setParticipations,
  raidId,
  isAdmin,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipation, setEditingParticipation] = useState(null);

  const { deleteParticipation } = useRaidsApi();

  const handleDelete = async (id) => {
    try {
      await deleteParticipation(id);
      setParticipations((prev) => prev.filter((p) => p.id !== id));
      toast.success("Participation deleted");
    } catch (err) {
      console.error(err);
      toast.error("Error deleting participation");
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
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(h.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
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
            participation={editingParticipation} // pass if editing
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
