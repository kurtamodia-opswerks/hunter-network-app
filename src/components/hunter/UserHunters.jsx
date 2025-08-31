import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import HunterCard from "@/components/hunter/HunterCard";

export default function UserHunters({
  hunters,
  loading,
  search,
  setSearch,
  rank,
  setRank,
}) {
  const [showAllPower, setShowAllPower] = useState(false);
  const [showAllRaid, setShowAllRaid] = useState(false);

  const powerRankings = [...hunters].sort(
    (a, b) => b.power_level - a.power_level
  );
  const raidLeaders = [...hunters].sort((a, b) => b.raid_count - a.raid_count);

  const displayedPower = showAllPower
    ? powerRankings
    : powerRankings.slice(0, 5);
  const displayedRaid = showAllRaid ? raidLeaders : raidLeaders.slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-center">Hunter Rankings</h1>

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

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Power Rankings
          </h2>
          <div className="space-y-4">
            {displayedPower.map((h) => (
              <HunterCard key={h.id} hunter={h} isAdmin={false} />
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

        <section>
          <h2 className="text-xl font-semibold mb-4 text-center">
            Raid Leaders
          </h2>
          <div className="space-y-4">
            {displayedRaid.map((h) => (
              <HunterCard key={h.id} hunter={h} isAdmin={false} />
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
