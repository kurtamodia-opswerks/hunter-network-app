import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useAuthFetch } from "../hooks/useAuthFetch";
import { toast } from "sonner";

export default function EditHunterForm({ hunter, onClose, onUpdated }) {
  const authFetch = useAuthFetch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    username: "",
    guild: null,
    skills: [],
    rank: "E",
  });

  const [guilds, setGuilds] = useState([]);
  const [skills, setSkills] = useState([]);

  // Prefill hunter data
  useEffect(() => {
    if (hunter) {
      setFormData({
        email: hunter.email || "",
        password: "",
        first_name: hunter.first_name || "",
        last_name: hunter.last_name || "",
        username: hunter.username || "",
        guild: hunter.guild || null,
        skills: hunter.skills || [],
        rank: hunter.rank || "E",
      });
    }
  }, [hunter]);

  // Load guilds & skills from API
  useEffect(() => {
    const fetchOptions = async () => {
      const guildRes = await authFetch("http://localhost:8000/api/guilds/");
      if (guildRes.ok) setGuilds(await guildRes.json());

      const skillRes = await authFetch("http://localhost:8000/api/skills/");
      if (skillRes.ok) setSkills(await skillRes.json());
    };
    fetchOptions();

    return () => {};
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMultiSelect = (skillId) => {
    setFormData((prev) => {
      const exists = prev.skills.includes(skillId);
      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((s) => s !== skillId)
          : [...prev.skills, skillId],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        password: formData.password || hunter.password,
        guild: formData.guild ? Number(formData.guild) : null,
        skills: formData.skills.map((s) => Number(s)),
      };
      console.log("Submitting payload:", payload);

      const response = await authFetch(
        `http://localhost:8000/api/hunters/${hunter.id}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) throw new Error("Failed to update hunter");
      const data = await response.json();
      if (onUpdated) onUpdated(data);
      toast.success("Hunter updated successfully");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error updating hunter");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Hunter</CardTitle>
          <CardDescription>Update hunter details</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep unchanged"
              />
            </div>

            {/* Guild */}
            <div className="space-y-2">
              <Label>Guild</Label>
              <Select
                value={formData.guild ? String(formData.guild) : ""}
                onValueChange={(val) =>
                  handleSelectChange("guild", val === "" ? null : Number(val))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select guild" />
                </SelectTrigger>
                <SelectContent>
                  {guilds.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skills (multi-select checkboxes) */}
            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
                    variant={
                      formData.skills.includes(s.id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleMultiSelect(s.id)}
                  >
                    {s.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rank */}
            <div className="space-y-2">
              <Label>Rank</Label>
              <Select
                value={formData.rank}
                onValueChange={(val) => handleSelectChange("rank", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
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
