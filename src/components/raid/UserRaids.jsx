import LoadingSkeleton from "@/components/LoadingSkeleton";
import RaidCard from "@/components/raid/RaidCard";

export default function UserRaids({
  raids,
  participations,
  loadingRaids,
  loadingParticipations,
}) {
  return (
    <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 center mx-auto">
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
