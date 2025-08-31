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
import { Users, Plus } from "lucide-react";
import RaidParticipationForm from "./RaidParticipationForm";

export default function RaidParticipations({
  participations,
  setParticipations,
  raidId,
  isAdmin,
}) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
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
              <Button className="mt-4" onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Participation
              </Button>
            )}
          </>
        ) : (
          <RaidParticipationForm
            raidId={raidId}
            onClose={() => setShowAddForm(false)}
            onAdded={(newP) => setParticipations((prev) => [...prev, newP])}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
