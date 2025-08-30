import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAuthFetch } from "../hooks/useAuthFetch";

export default function EditRaidForm({ raid, onClose, onUpdated }) {
  const authFetch = useAuthFetch();

  const [formData, setFormData] = useState({
    name: "",
    dungeon: null,
    date: "",
    success: true,
    team_strength: "",
    participations_info: "",
  });

  const [dungeons, setDungeons] = useState([]);

  // Prefill raid data
  useEffect(() => {
    if (raid) {
      setFormData({
        name: raid.name || "",
        dungeon: raid.dungeon || null,
        date: raid.date || "",
        success: raid.success || false,
        team_strength: raid.team_strength || "",
        participations_info: raid.participations_info || "",
      });
    }
  }, [raid]);

  // Load dungeon options
  useEffect(() => {
    const fetchDungeons = async () => {
      const response = await authFetch("http://localhost:8000/api/dungeons/");
      if (response.ok) {
        setDungeons(await response.json());
      }
    };
    fetchDungeons();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      dungeon: formData.dungeon ? Number(formData.dungeon) : null,
      success: Boolean(formData.success),
    };

    try {
      const response = await authFetch(
        `http://localhost:8000/api/raids/${raid.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update raid");
      const data = await response.json();
      if (onUpdated) onUpdated(data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Raid</CardTitle>
          <CardDescription>Update raid details</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Raid Name</Label>
              <Input id="name" value={formData.name} onChange={handleChange} />
            </div>

            {/* Dungeon */}
            <div className="space-y-2">
              <Label>Dungeon</Label>
              <Select
                value={formData.dungeon ? String(formData.dungeon) : ""}
                onValueChange={(val) =>
                  handleSelectChange("dungeon", val === "" ? null : Number(val))
                }
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
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            {/* Success */}
            <div className="space-y-2">
              <Label>Success</Label>
              <Select
                value={formData.success ? "true" : "false"}
                onValueChange={(val) =>
                  handleSelectChange("success", val === "true")
                }
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

            {/* Team Strength */}
            <div className="space-y-2">
              <Label htmlFor="team_strength">Team Strength</Label>
              <Input
                id="team_strength"
                value={formData.team_strength}
                onChange={handleChange}
              />
            </div>

            {/* Participations Info */}
            <div className="space-y-2">
              <Label htmlFor="participations_info">Participations Info</Label>
              <Input
                id="participations_info"
                value={formData.participations_info}
                onChange={handleChange}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
