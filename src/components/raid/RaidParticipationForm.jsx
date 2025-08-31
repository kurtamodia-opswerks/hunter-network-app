import { useState, useEffect } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
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

export default function RaidParticipationForm({
  raidId,
  participation,
  onClose,
  onAdded,
  onUpdated,
}) {
  const authFetch = useAuthFetch();
  const [hunters, setHunters] = useState([]);
  const [selectedHunter, setSelectedHunter] = useState(
    participation ? String(participation.hunter_id) : ""
  );
  const [role, setRole] = useState(participation ? participation.role : "Tank");

  // Fetch hunters for dropdown
  useEffect(() => {
    const fetchHunters = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/hunters/");
        if (res.ok) {
          setHunters(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch hunters:", err);
      }
    };
    fetchHunters();
  }, [authFetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      raid: raidId,
      hunter: Number(selectedHunter),
      role,
    };

    let url = "http://localhost:8000/api/raid-participations/";
    let method = "POST";

    if (participation) {
      url += `${participation.id}/`;
      method = "PUT";
    }

    const res = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (participation) {
        toast.success("Participation updated successfully!");
        onUpdated(data);
      } else {
        toast.success("Participation added successfully!");
        onAdded(data);
      }
      onClose();
    } else {
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
            {hunters.map((h) => (
              <SelectItem key={h.id} value={String(h.id)}>
                {h.full_name} ({h.rank_display})
              </SelectItem>
            ))}
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
