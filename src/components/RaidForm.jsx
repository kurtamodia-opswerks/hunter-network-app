import { useState, useEffect } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RaidForm({ mode = "create", raid, onClose, onSaved }) {
  const authFetch = useAuthFetch();

  // Raid fields
  const [name, setName] = useState(raid?.name || "");
  const [dungeon, setDungeon] = useState(raid?.dungeon || "");
  const [date, setDate] = useState(raid?.date || "");
  const [success, setSuccess] = useState(raid?.success || false);
  const [teamStrength, setTeamStrength] = useState(raid?.team_strength || "");

  // Dropdown data
  const [dungeons, setDungeons] = useState([]);
  const [hunters, setHunters] = useState([]);

  // Participation state
  const [selectedHunter, setSelectedHunter] = useState("");
  const [role, setRole] = useState("Tank");

  // Fetch dungeons
  useEffect(() => {
    const fetchDungeons = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/dungeons/");
        if (res.ok) setDungeons(await res.json());
      } catch (err) {
        console.error("Failed to fetch dungeons:", err);
      }
    };
    fetchDungeons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      dungeon: dungeon ? Number(dungeon) : null,
      date,
      success,
      participations_create: selectedHunter
        ? [{ hunter_id: Number(selectedHunter), role }]
        : [],
    };

    const url =
      mode === "edit"
        ? `http://localhost:8000/api/raids/${raid.id}/`
        : "http://localhost:8000/api/raids/";

    const method = mode === "edit" ? "PUT" : "POST";

    const response = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const savedRaid = await response.json();
      onSaved(savedRaid);
      toast.success(
        mode === "edit"
          ? "Raid updated successfully!"
          : "Raid created successfully!"
      );
      onClose();
    } else {
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} raid`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name">Raid Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter raid name"
        />
      </div>

      {/* Dungeon */}
      <div>
        <Label>Dungeon</Label>
        <Select
          value={dungeon ? String(dungeon) : ""}
          onValueChange={(val) => setDungeon(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select dungeon" />
          </SelectTrigger>
          <SelectContent>
            {dungeons.map((d) => (
              <SelectItem key={d.id} value={String(d.id)}>
                {d.name} ({d.rank})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date */}
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Success */}
      <div>
        <Label>Success</Label>
        <Select
          value={success ? "true" : "false"}
          onValueChange={(val) => setSuccess(val === "true")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Success</SelectItem>
            <SelectItem value="false">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {mode === "edit" ? "Save Changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}
