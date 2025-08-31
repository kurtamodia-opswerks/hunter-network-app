// components/guild/GuildMemberSheet.jsx
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
import { useAuthFetch } from "@/hooks/useAuthFetch";

export default function GuildMemberSheet({ guildId, onClose, onSaved }) {
  const authFetch = useAuthFetch();

  const [loading, setLoading] = useState(false);
  const [availableHunters, setAvailableHunters] = useState([]);
  const [selectedHunterId, setSelectedHunterId] = useState("");

  // Fetch hunters with no guild
  useEffect(() => {
    const loadHunters = async () => {
      try {
        const res = await authFetch(
          "http://localhost:8000/api/hunters/?guild_isnull=true",
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to load available hunters.");
        const data = await res.json();
        console.log("Available hunters:", data.results || data);
        setAvailableHunters(data.results || data);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      }
    };
    loadHunters();
  }, [authFetch]);

  const handleSave = async () => {
    if (!selectedHunterId) return toast.error("Please select a hunter.");

    setLoading(true);
    try {
      const res = await authFetch(
        `http://localhost:8000/api/hunters/${selectedHunterId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guild: guildId }),
        }
      );
      if (!res.ok) throw new Error("Failed to add member.");
      const addedMember = await res.json();
      console.log("Added member:", addedMember);
      toast.success("Member added!");
      onSaved(addedMember);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Select Hunter</Label>
        <Select value={selectedHunterId} onValueChange={setSelectedHunterId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="-- Select a hunter --" />
          </SelectTrigger>
          <SelectContent>
            {availableHunters.map((h) => (
              <SelectItem key={h.id} value={h.id.toString()}>
                {h.full_name} ({h.rank_display})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
}
