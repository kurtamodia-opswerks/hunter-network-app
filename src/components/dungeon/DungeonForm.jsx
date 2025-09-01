import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useDungeonsApi } from "@/api/dungeonsApi";

export default function DungeonForm({
  mode = "create",
  dungeon,
  onClose,
  onSaved,
}) {
  const { createDungeon, updateDungeon } = useDungeonsApi();

  const [name, setName] = useState(dungeon?.name || "");
  const [rank, setRank] = useState(dungeon?.rank || "E");
  const [location, setLocation] = useState(dungeon?.location || "");
  const [isOpen, setIsOpen] = useState(dungeon?.is_open ?? true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { name, rank, location, is_open: isOpen };

    try {
      let saved;
      if (mode === "edit") {
        saved = await updateDungeon(dungeon.id, payload);
        toast.success("Dungeon updated successfully!");
      } else {
        saved = await createDungeon(payload);
        toast.success("Dungeon created successfully!");
      }
      onSaved(saved);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} dungeon`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      {/* Rank */}
      <div>
        <Label htmlFor="rank">Rank</Label>
        <Select value={rank} onValueChange={(val) => setRank(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Rank" />
          </SelectTrigger>
          <SelectContent>
            {["S", "A", "B", "C", "D", "E"].map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      {/* Open Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox id="is_open" checked={isOpen} onCheckedChange={setIsOpen} />
        <Label htmlFor="is_open" className="!mb-0">
          Open
        </Label>
      </div>

      {/* Actions */}
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
