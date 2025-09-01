import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Trash, Plus } from "lucide-react";
import GuildMemberSheet from "./GuildMemberSheet";

export default function GuildMembers({
  guild,
  user,
  isAdmin,
  setGuild,
  authFetch,
}) {
  const [showAddMember, setShowAddMember] = useState(false);

  const canManage =
    isAdmin || guild?.leader_display?.id === Number(user?.user_id);

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
      } else {
        alert("Failed to remove member.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing member.");
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Members</h2>
        {canManage && (
          <Button
            onClick={() => setShowAddMember(true)}
            variant="outline"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Member
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
              {canManage && (
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
    </section>
  );
}
