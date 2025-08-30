import { useState, useEffect } from "react";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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

export default function EditGuildForm({ guild, onClose, onUpdated }) {
  const authFetch = useAuthFetch();

  const [name, setName] = useState(guild?.name || "");
  const [leader, setLeader] = useState(guild?.leader || "");
  const [foundedDate, setFoundedDate] = useState(guild?.founded_date || "");
  const [hunters, setHunters] = useState([]);

  // Fetch hunters for dropdown
  useEffect(() => {
    const fetchHunters = async () => {
      try {
        const res = await authFetch("http://localhost:8000/api/hunters/");
        if (res.ok) {
          const data = await res.json();
          setHunters(data);
        }
      } catch (err) {
        console.error("Failed to fetch hunters:", err);
      }
    };
    fetchHunters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};
    if (name.trim() !== "") payload.name = name;
    if (leader !== "") payload.leader = Number(leader);
    if (foundedDate !== "") payload.founded_date = foundedDate;

    const response = await authFetch(
      `http://localhost:8000/api/guilds/${guild.id}/`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (response.ok) {
      const updatedGuild = await response.json();
      onUpdated(updatedGuild);
      toast.success("Guild updated successfully!");
      onClose();
    } else {
      console.error("Failed to update guild");
      toast.error("Failed to update guild");
    }
  };

  return (
    <Dialog open={!!guild} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Guild</DialogTitle>
        </DialogHeader>

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
                    {h.username} ({h.first_name} {h.last_name})
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
