import { useState, useEffect } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
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

export default function GuildForm({
  mode = "create",
  guild,
  onClose,
  onSaved,
}) {
  const authFetch = useAuthFetch();

  const [name, setName] = useState(guild?.name || "");
  const [leader, setLeader] = useState(guild?.leader || "");
  const [foundedDate, setFoundedDate] = useState(guild?.founded_date || "");
  const [hunters, setHunters] = useState([]);

  // Fetch hunters
  useEffect(() => {
    const fetchHunters = async () => {
      try {
        let url = "http://localhost:8000/api/hunters/";

        if (mode === "edit" && guild?.id) {
          // Only fetch hunters who are members of this guild
          url += `?guild=${guild.id}`;
        }

        const res = await authFetch(url);
        if (res.ok) {
          const data = await res.json();
          setHunters(data);
        }
      } catch (err) {
        console.error("Failed to fetch hunters:", err);
      }
    };

    fetchHunters();
  }, [authFetch, mode, guild]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};
    if (name.trim() !== "") payload.name = name;
    if (leader !== "") payload.leader = Number(leader);
    if (foundedDate !== "") payload.founded_date = foundedDate;

    const url =
      mode === "edit"
        ? `http://localhost:8000/api/guilds/${guild.id}/`
        : "http://localhost:8000/api/guilds/";

    const method = mode === "edit" ? "PUT" : "POST";

    const response = await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const savedGuild = await response.json();
      onSaved(savedGuild);
      toast.success(
        mode === "edit"
          ? "Guild updated successfully!"
          : "Guild created successfully!"
      );
      onClose();
    } else {
      console.error("Failed to save guild");
      toast.error(`Failed to ${mode === "edit" ? "update" : "create"} guild`);
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
          placeholder="Enter guild name"
        />
      </div>

      {/* Leader Dropdown */}
      <div>
        <Label htmlFor="leader">Leader</Label>
        <Select
          value={leader ? String(leader) : ""}
          onValueChange={(val) => setLeader(val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select leader" />
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

      {/* Founded Date */}
      <div>
        <Label htmlFor="founded">Founded Date</Label>
        <Input
          id="founded"
          type="date"
          value={foundedDate}
          onChange={(e) => setFoundedDate(e.target.value)}
        />
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
