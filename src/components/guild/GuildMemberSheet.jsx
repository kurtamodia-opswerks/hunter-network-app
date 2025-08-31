// components/guild/GuildMemberSheet.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function GuildMemberSheet({
  guildId,
  member = null,
  onClose,
  onSaved,
}) {
  const authFetch = useAuthFetch();

  const [fullName, setFullName] = useState(member?.full_name || "");
  const [rank, setRank] = useState(member?.rank_display || "");
  const [loading, setLoading] = useState(false);
  const [availableHunters, setAvailableHunters] = useState([]);

  // Fetch hunters with no guild if adding a new member
  useEffect(() => {
    if (!member) {
      const loadHunters = async () => {
        try {
          const res = await authFetch(
            "http://localhost:8000/api/hunters/?guild_isnull=true",
            {
              cache: "no-store",
            }
          );
          if (res.ok) {
            const data = await res.json();
            setAvailableHunters(data.results || data);
          } else {
            toast.error("Failed to load available hunters.");
          }
        } catch (err) {
          console.error(err);
          toast.error("Error fetching hunters.");
        }
      };
      loadHunters();
    }
  }, [member]);

  const handleSave = async () => {
    setLoading(true);

    try {
      if (member) {
        // Editing an existing member
        const res = await authFetch(
          `http://localhost:8000/api/hunters/${member.id}/`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ full_name: fullName, rank_display: rank }),
          }
        );
        if (res.ok) {
          const updatedMember = await res.json();
          toast.success("Member updated!");
          onSaved(updatedMember);
          onClose();
        } else toast.error("Failed to update member.");
      } else {
        // Adding a new member
        if (!fullName) return toast.error("Please select a hunter.");
        const selectedHunter = availableHunters.find(
          (h) => h.id === parseInt(fullName)
        );
        if (!selectedHunter) return toast.error("Invalid hunter selected.");

        const res = await authFetch(
          `http://localhost:8000/api/hunters/${selectedHunter.id}/`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guild: guildId }),
          }
        );
        if (res.ok) {
          const addedMember = await res.json();
          toast.success("Member added!");
          onSaved(addedMember);
          onClose();
        } else toast.error("Failed to add member.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      {member ? (
        <>
          <div>
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <Label>Rank</Label>
            <Input value={rank} onChange={(e) => setRank(e.target.value)} />
          </div>
        </>
      ) : (
        <div>
          <Label>Select Hunter</Label>
          <Select value={fullName} onValueChange={(val) => setFullName(val)}>
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
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : member ? "Save" : "Add"}
        </Button>
      </div>
    </div>
  );
}
