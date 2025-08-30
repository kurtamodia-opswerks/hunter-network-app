import { useState } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export default function DungeonForm({
  dungeon,
  onClose,
  onUpdated,
  onCreated,
}) {
  const authFetch = useAuthFetch();

  const [formData, setFormData] = useState({
    name: dungeon?.name || "",
    rank: dungeon?.rank || "E",
    location: dungeon?.location || "",
    is_open: dungeon?.is_open ?? true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = dungeon ? "PUT" : "POST";
    const url = dungeon
      ? `http://localhost:8000/api/dungeons/${dungeon.id}/`
      : "http://localhost:8000/api/dungeons/";

    const response = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      if (dungeon) {
        onUpdated?.(data);
        toast.success("Dungeon updated successfully");
      } else {
        onCreated?.(data);
        toast.success("Dungeon created successfully");
      }
      onClose();
    } else {
      toast.error("Failed to save dungeon");
    }
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{dungeon ? "Edit Dungeon" : "Add Dungeon"}</SheetTitle>
          <SheetDescription>
            {dungeon
              ? "Update the dungeon details below."
              : "Fill out the form to create a new dungeon."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="rank">Rank</Label>
            <Select
              value={formData.rank}
              onValueChange={(val) => setFormData({ ...formData, rank: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Rank" />
              </SelectTrigger>
              <SelectContent>
                {["S", "A", "B", "C", "D", "E"].map((rank) => (
                  <SelectItem key={rank} value={rank}>
                    {rank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_open"
              checked={formData.is_open}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_open: checked })
              }
            />
            <Label htmlFor="is_open">Open</Label>
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{dungeon ? "Save Changes" : "Create"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
