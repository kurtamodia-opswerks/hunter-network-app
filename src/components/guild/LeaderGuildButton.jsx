import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LeaderGuildButton({ userId }) {
  const navigate = useNavigate();
  const authFetch = useAuthFetch();
  const [leaderGuild, setLeaderGuild] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderGuild = async () => {
      setLoading(true);
      try {
        const userRes = await authFetch(
          `http://localhost:8000/api/hunters/${userId}/`
        );
        if (!userRes.ok) throw new Error("Failed to fetch user info");
        const userData = await userRes.json();

        if (userData.guild) {
          const guildRes = await authFetch(
            `http://localhost:8000/api/guilds/${userData.guild}/`
          );
          if (!guildRes.ok) throw new Error("Failed to fetch guild info");
          const guildData = await guildRes.json();

          if (guildData.leader_display?.id === Number(userId)) {
            setLeaderGuild(guildData);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderGuild();
  }, [userId]);

  if (!leaderGuild && !loading) return null;

  return (
    <div className="text-center">
      <Button
        onClick={() => navigate(`/guilds/${leaderGuild?.id}`)}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking if you lead a guild...
          </span>
        ) : (
          "Go to Your Guild"
        )}
      </Button>
    </div>
  );
}
