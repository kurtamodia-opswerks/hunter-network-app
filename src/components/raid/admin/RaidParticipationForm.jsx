// src/components/raid/RaidParticipationForm.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRaidsApi } from "@/api/raidsApi";

export default function RaidParticipationForm({
  raidId,
  participation,
  participations = [], // existing participations in the raid
  onClose,
  onAdded,
  onUpdated,
}) {
  const { getHunters, createParticipation, updateParticipation } =
    useRaidsApi();

  const [hunters, setHunters] = useState([]);
  const [selectedHunter, setSelectedHunter] = useState(
    participation ? String(participation.hunter_id) : ""
  );
  const [role, setRole] = useState(participation ? participation.role : "Tank");

  // Fetch hunters and filter out ones already in the raid
  useEffect(() => {
    const fetchHunters = async () => {
      try {
        const allHunters = await getHunters();

        const filtered = allHunters.filter(
          (h) =>
            !participations.some(
              (p) =>
                p.hunter_id === h.id &&
                (!participation || p.id !== participation.id)
            )
        );

        setHunters(filtered);
      } catch (err) {
        console.error("Failed to fetch hunters:", err);
        toast.error("Failed to load hunters");
      }
    };
    fetchHunters();
  }, [getHunters, participations, participation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      raid: raidId,
      hunter: Number(selectedHunter),
      role,
    };

    try {
      if (participation) {
        const updated = await updateParticipation(participation.id, payload);
        toast.success("Participation updated successfully!");
        onUpdated(updated);
      } else {
        const created = await createParticipation(payload);
        toast.success("Participation added successfully!");
        onAdded(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save participation");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hunter */}
      <div>
        <Label>Hunter</Label>
        <Select
          value={selectedHunter}
          onValueChange={(val) => setSelectedHunter(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select hunter" />
          </SelectTrigger>
          <SelectContent>
            {hunters.length > 0 ? (
              hunters.map((h) => (
                <SelectItem key={h.id} value={String(h.id)}>
                  {h.full_name} ({h.rank_display})
                </SelectItem>
              ))
            ) : (
              <SelectItem value="#" disabled>
                No available hunters
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Role */}
      <div>
        <Label>Role</Label>
        <Select value={role} onValueChange={(val) => setRole(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Tank">Tank</SelectItem>
            <SelectItem value="Healer">Healer</SelectItem>
            <SelectItem value="DPS">DPS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{participation ? "Update" : "Add"}</Button>
      </div>
    </form>
  );
}
