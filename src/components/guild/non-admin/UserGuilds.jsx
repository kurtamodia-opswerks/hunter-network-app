import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import GuildCard from "@/components/guild/GuildCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import LeaderGuildButton from "@/components/guild/non-admin/LeaderGuildButton";

export default function UserGuilds({
  guilds,
  loading,
  search,
  setSearch,
  ordering,
  setOrdering,
  userId,
  isAdmin,
}) {
  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div className="flex gap-2">
          {/* Search */}
          <Input
            placeholder="Search guilds..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
          />
          {/* Ordering */}
          <Select value={ordering} onValueChange={setOrdering}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="-name">Name (Z-A)</SelectItem>
              <SelectItem value="founded_date">Founded (Oldest)</SelectItem>
              <SelectItem value="-founded_date">Founded (Newest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          {!isAdmin && <LeaderGuildButton userId={userId} />}
        </div>
      </div>

      {/* Guilds Grid */}
      <div className="max-w-6xl mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))
          : guilds.map((guild) => (
              <GuildCard key={guild.id} guild={guild} isAdmin={false} />
            ))}
      </div>
    </div>
  );
}
