// GuildPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Trash } from "lucide-react";
import GuildMemberSheet from "@/components/guild/GuildMemberSheet";

export default function GuildPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const { user } = useAuth();
  const isAdmin = user?.is_admin || false;

  const [guild, setGuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);

  const loadGuild = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await authFetch(`http://localhost:8000/api/guilds/${id}/`, {
        cache: "no-store",
      });
      if (res.ok) setGuild(await res.json());
      else toast.error("Failed to load guild.");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching guild.");
    }
    setLoading(false);
  };

  const handleDeleteMember = async (memberId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      const res = await authFetch(
        `http://localhost:8000/api/hunters/${memberId}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guild: null }),
        }
      );
      if (res.ok) {
        setGuild((prev) => ({
          ...prev,
          members: prev.members.filter((m) => m.id !== memberId),
          member_count: prev.members.length - 1,
        }));
        toast.success("Member removed.");
      } else toast.error("Failed to remove member.");
    } catch (err) {
      console.error(err);
      toast.error("Error removing member.");
    }
  };

  useEffect(() => {
    loadGuild();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading guild...</p>;
  if (!guild) return <p className="text-center mt-20">Guild not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold">{guild.name}</h1>
        <Badge className="mt-2 md:mt-0">{guild.member_count} members</Badge>
      </header>

      <Separator className="mb-6" />

      {/* Leader Info */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Leader</h2>
        <p>
          {guild.leader_display
            ? `${guild.leader_display.full_name} (${guild.leader_display.rank_display})`
            : "Unassigned"}
        </p>
        <p className="text-sm text-muted-foreground">
          Founded: {guild.founded_date}
        </p>
      </section>

      <Separator className="mb-6" />

      {/* Members Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Members</h2>
          {isAdmin && (
            <Button
              onClick={() => setShowAddMember(true)}
              variant="outline"
              size="sm"
            >
              <span className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                Add Member
              </span>
            </Button>
          )}
        </div>

        {guild.members.length === 0 ? (
          <p>No members yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {guild.members.map((m) => (
              <li
                key={m.id}
                className="p-3 border rounded-md flex justify-between items-center shadow-sm"
              >
                <span>
                  {m.full_name}{" "}
                  <span className="text-sm text-muted-foreground">
                    ({m.rank_display})
                  </span>
                </span>
                {isAdmin && (
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteMember(m.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Add Member Sheet */}
      {showAddMember && (
        <Sheet
          open={showAddMember}
          onOpenChange={(open) => !open && setShowAddMember(false)}
        >
          <SheetContent side="right" className="w-[400px] p-4">
            <SheetHeader>
              <SheetTitle>Add Member</SheetTitle>
            </SheetHeader>

            <GuildMemberSheet
              guildId={guild.id}
              onClose={() => setShowAddMember(false)}
              onSaved={(savedMember) => {
                setGuild((prev) => ({
                  ...prev,
                  members: [...prev.members, savedMember],
                  member_count: prev.members.length + 1,
                }));
              }}
            />
          </SheetContent>
        </Sheet>
      )}

      <div className="mt-10">
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
}
