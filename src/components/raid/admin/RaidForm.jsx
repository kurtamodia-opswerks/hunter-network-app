// src/components/raid/RaidForm.jsx
import { useState, useEffect } from "react";
import { useRaidsApi } from "@/api/raidsApi";
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
  const { createRaid, updateRaid, getDungeons } = useRaidsApi();

  // Raid fields
  const [name, setName] = useState(raid?.name || "");
  const [dungeon, setDungeon] = useState(raid?.dungeon || "");
  const [date, setDate] = useState(raid?.date || "");
  const [success, setSuccess] = useState(raid?.success || false);

  // Dropdown data
  const [dungeons, setDungeons] = useState([]);

  // Participation state
  const [selectedHunter, setSelectedHunter] = useState("");
  const [role, setRole] = useState("Tank");

  // Fetch dungeons
  useEffect(() => {
    const fetchDungeons = async () => {
      try {
        const data = await getDungeons();
        setDungeons(data);
      } catch (err) {
        console.error("Failed to fetch dungeons:", err);
        toast.error("Failed to load dungeons");
      }
    };
    fetchDungeons();
  }, [getDungeons]);

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

    try {
      const savedRaid =
        mode === "edit"
          ? await updateRaid(raid.id, payload)
          : await createRaid(payload);

      onSaved(savedRaid);
      toast.success(
        mode === "edit"
          ? "Raid updated successfully!"
          : "Raid created successfully!"
      );
      onClose();
    } catch (err) {
      console.error(err);
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
            {dungeons
              .filter((d) => d.is_open)
              .map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name} ({d.rank_display})
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
            <SelectItem value="true">Yes</SelectItem>
            <SelectItem value="false">No</SelectItem>
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
