import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFetchSkillsAndGuilds } from "@/hooks/useFetchSkillsAndGuilds";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HunterPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authFetch = useAuthFetch();

  const [hunter, setHunter] = useState(null);
  const [loading, setLoading] = useState(true);

  const { skills } = useFetchSkillsAndGuilds();

  useEffect(() => {
    const loadHunter = async () => {
      if (!id) return;
      setLoading(true);

      try {
        const res = await authFetch(`http://localhost:8000/api/hunters/${id}/`);
        if (!res.ok) throw new Error("Failed to load hunter");
        const data = await res.json();
        setHunter(data);
      } catch (err) {
        console.error(err);
        toast.error("Error loading hunter");
      }

      setLoading(false);
    };

    loadHunter();
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading hunter...</p>;
  if (!hunter) return <p className="text-center mt-20">Hunter not found.</p>;

  const skillMap = Object.fromEntries(skills.map((s) => [s.id, s.name]));

  const skillNames =
    hunter.skills?.length > 0
      ? hunter.skills.map((id) => skillMap[id] || `Skill ${id}`).join(", ")
      : "None";

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl">{hunter.full_name}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">{hunter.rank_display}</Badge>
            {hunter.guild_name && (
              <Badge variant="outline">{hunter.guild_name}</Badge>
            )}
          </div>
          <CardDescription>{hunter.email}</CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-2 gap-4">
          <p>
            <span className="font-semibold">Username:</span> {hunter.username}
          </p>
          <p>
            <span className="font-semibold">Date Joined:</span>{" "}
            {hunter.date_joined}
          </p>
          <p>
            <span className="font-semibold">Power Level:</span>{" "}
            {hunter.power_level}
          </p>
          <p>
            <span className="font-semibold">Raid Count:</span>{" "}
            {hunter.raid_count}
          </p>
          <div className="col-span-2">
            <span className="font-semibold">Skills:</span> {skillNames}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={() => navigate(-1)}>Back</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
