// src/components/UserHunters.jsx
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import HunterCard from "@/components/HunterCard";

export default function UserHunters() {
  const authFetch = useAuthFetch();
  const [hunters, setHunters] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState("");
  const [rank, setRank] = useState("all");

  useEffect(() => {
    const loadHunters = async () => {
      let url = `http://localhost:8000/api/hunters/?ordering=-rank`;

      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (rank !== "all") {
        url += `&rank=${encodeURIComponent(rank)}`;
      }

      const response = await authFetch(url);
      if (response.ok) {
        const data = await response.json();
        setHunters(data);
      }
    };
    loadHunters();
  }, [search, rank]);

  const displayedHunters = showAll ? hunters : hunters.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Hunter Power Rankings</h1>

      {/* Search + Rank Filter Row */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <Input
          placeholder="Search hunters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={rank} onValueChange={setRank}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ranks</SelectItem>
            <SelectItem value="S">Rank S</SelectItem>
            <SelectItem value="A">Rank A</SelectItem>
            <SelectItem value="B">Rank B</SelectItem>
            <SelectItem value="C">Rank C</SelectItem>
            <SelectItem value="D">Rank D</SelectItem>
            <SelectItem value="E">Rank E</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hunters List (using HunterCard) */}
      <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        {displayedHunters.map((hunter) => (
          <HunterCard key={hunter.id} hunter={hunter} isAdmin={false} />
        ))}
      </div>

      {/* View More Button */}
      {!showAll && hunters.length > 5 && (
        <div className="flex justify-center">
          <Button onClick={() => setShowAll(true)}>View Full List</Button>
        </div>
      )}
    </div>
  );
}
