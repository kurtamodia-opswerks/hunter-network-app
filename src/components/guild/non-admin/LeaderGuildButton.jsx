// src/components/guild/LeaderGuildButton.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useGuildsApi } from "@/api/guildsApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function LeaderGuildButton() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getGuildsByLeader } = useGuildsApi();

  const [guildId, setGuildId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuildIfLeader = async () => {
      if (!user?.is_leader) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getGuildsByLeader(user.user_id);
        if (data.length > 0) setGuildId(data[0].id);
      } catch (err) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGuildIfLeader();
  }, [user]);

  if (!user?.is_leader || (!guildId && !loading)) return null;

  return (
    <div className="text-center">
      <Button onClick={() => navigate(`/guilds/${guildId}`)} disabled={loading}>
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
