import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import GuildHeader from "@/components/guild/GuildHeader";
import GuildLeaderInfo from "@/components/guild/GuildLeaderInfo";
import GuildMembers from "@/components/guild/GuildMembers";

export default function GuildPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const { user } = useAuth();
  const isAdmin = user?.is_admin || false;

  const [guild, setGuild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    loadGuild();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading guild...</p>;
  if (!guild) return <p className="text-center mt-20">Guild not found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <GuildHeader name={guild.name} memberCount={guild.member_count} />
      <GuildLeaderInfo
        leader={guild.leader_display}
        foundedDate={guild.founded_date}
      />
      <GuildMembers
        guild={guild}
        user={user}
        isAdmin={isAdmin}
        setGuild={setGuild}
        authFetch={authFetch}
      />
      <div className="mt-10">
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
}
