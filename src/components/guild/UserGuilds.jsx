// src/components/UserGuilds.jsx
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useEffect, useState } from "react";
import GuildCard from "@/components/guild/GuildCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function UserGuilds() {
  const authFetch = useAuthFetch();
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  // search + filters
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("name"); // default sort

  // Fetch guilds
  const loadGuilds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (ordering) params.append("ordering", ordering);
      const response = await authFetch(
        `http://localhost:8000/api/guilds/?${params.toString()}`,
        { cache: "no-store" }
      );

      if (response.ok) {
        const data = await response.json();
        setGuilds(data);
      } else {
        console.error("Failed to load guilds");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGuilds();
  }, [search, ordering]);

  return (
    <div className="space-y-4">
      {/* Filters Row */}
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <Input
          placeholder="Search guilds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64"
        />

        <div className="flex gap-2">
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

          <Button variant="outline" onClick={loadGuilds}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Guilds Grid */}
      <div className="mx-auto grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
