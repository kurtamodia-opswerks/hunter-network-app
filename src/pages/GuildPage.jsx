// src/pages/GuildPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGuildsApi } from "@/api/guildsApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import GuildHeader from "@/components/guild/guild-page-components/GuildHeader";
import GuildLeaderInfo from "@/components/guild/guild-page-components/GuildLeaderInfo";
import GuildMembers from "@/components/guild/guild-page-components/GuildMembers";

export default function GuildPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.is_admin || false;

  const { getGuild } = useGuildsApi();

  const [guild, setGuild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuild = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getGuild(id);
        setGuild(data);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching guild.");
      } finally {
        setLoading(false);
      }
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
      />
      <div className="mt-10">
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
}
