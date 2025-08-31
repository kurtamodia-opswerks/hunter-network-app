import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import HunterCard from "@/components/hunter/HunterCard";

export default function UserHunters() {
  const authFetch = useAuthFetch();
  const { isLoggedIn } = useAuth();

  const [hunters, setHunters] = useState([]);
  const [search, setSearch] = useState("");
  const [rank, setRank] = useState("all");
  const [showAllPower, setShowAllPower] = useState(false);
  const [showAllRaid, setShowAllRaid] = useState(false);

  // Load hunters whenever search or rank changes
  useEffect(() => {
    const loadHunters = async () => {
      let url = `http://localhost:8000/api/hunters/?ordering=-power_level`;

      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (rank !== "all") url += `&rank=${encodeURIComponent(rank)}`;

      const res = await authFetch(url);
      if (res.ok) {
        const data = await res.json();
        setHunters(data);
      }
    };
    loadHunters();
  }, [search, rank]);

  // Prepare two sections
  const powerRankings = [...hunters].sort(
    (a, b) => b.power_level - a.power_level
  );
  const raidLeaders = [...hunters].sort((a, b) => b.raid_count - a.raid_count);

  const displayedPower = showAllPower
    ? powerRankings
    : powerRankings.slice(0, 5);
  const displayedRaid = showAllRaid ? raidLeaders : raidLeaders.slice(0, 5);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
        <p className="text-lg">Please log in to view the Hunters section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Hunter Rankings</h1>

      {/* Search + Rank Filter */}
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

      {/* Two Columns */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Rankings */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Power Rankings
          </h2>
          <div className="space-y-4">
            {displayedPower.map((hunter) => (
              <HunterCard key={hunter.id} hunter={hunter} isAdmin={false} />
            ))}
          </div>
          {!showAllPower && powerRankings.length > 5 && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => setShowAllPower(true)}>
                View Full List
              </Button>
            </div>
          )}
        </section>

        {/* Raid Leaders */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Raid Leaders
          </h2>
          <div className="space-y-4">
            {displayedRaid.map((hunter) => (
              <HunterCard key={hunter.id} hunter={hunter} isAdmin={false} />
            ))}
          </div>
          {!showAllRaid && raidLeaders.length > 5 && (
            <div className="flex justify-center mt-4">
              <Button onClick={() => setShowAllRaid(true)}>
                View Full List
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
