import { useState, useEffect } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";

import RaidCard from "@/components/raid/RaidCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function UserRaids() {
  const authFetch = useAuthFetch();

  const [raids, setRaids] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loadingRaids, setLoadingRaids] = useState(true);
  const [loadingParticipations, setLoadingParticipations] = useState(true);

  // Load raids
  const loadRaids = async () => {
    setLoadingRaids(true);
    try {
      const res = await authFetch("http://localhost:8000/api/raids/", {
        cache: "no-store",
      });
      if (res.ok) setRaids(await res.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load raids");
    }
    setLoadingRaids(false);
  };

  // Load user's participations
  const loadParticipations = async () => {
    setLoadingParticipations(true);
    try {
      const res = await authFetch(
        "http://localhost:8000/api/raid-participations/",
        { cache: "no-store" }
      );
      if (res.ok) setParticipations(await res.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load participations");
    }
    setLoadingParticipations(false);
  };

  useEffect(() => {
    loadRaids();
    loadParticipations();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      {/* All Raids */}
      <section>
        <h2 className="text-xl font-bold mb-4">All Raids</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {loadingRaids
            ? Array.from({ length: 4 }).map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))
            : raids.map((raid) => (
                <RaidCard key={raid.id} raid={raid} isAdmin={false} />
              ))}
        </div>
      </section>

      {/* My Participations */}
      <section>
        <h2 className="text-xl font-bold mb-4">My Participations</h2>
        {loadingParticipations ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <LoadingSkeleton key={idx} />
          ))
        ) : participations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have not joined any raids yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {participations.map((p) => {
              const raid = raids.find((r) => r.id === p.raid_id);
              if (!raid) return null;
              return <RaidCard key={p.id} raid={raid} readOnly={true} />;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
