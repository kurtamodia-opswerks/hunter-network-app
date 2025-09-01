import { Separator } from "@/components/ui/separator";

export default function GuildLeaderInfo({ leader, foundedDate }) {
  return (
    <>
      <Separator className="mb-6" />
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Leader</h2>
        <p>
          {leader
            ? `${leader.full_name} (${leader.rank_display})`
            : "Unassigned"}
        </p>
        <p className="text-sm text-muted-foreground">Founded: {foundedDate}</p>
      </section>
    </>
  );
}
