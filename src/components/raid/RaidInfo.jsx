// components/raid/RaidInfo.jsx
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";

export default function RaidInfo({ raid }) {
  return (
    <CardContent className="space-y-2 flex flex-col">
      <p>
        Dungeon: <span className="font-medium">{raid.dungeon_info.name}</span>
      </p>
      <p>
        Team Strength: <span className="font-medium">{raid.team_strength}</span>
      </p>
      <p>
        Success:{" "}
        {raid.success ? (
          <Badge variant="success">Yes</Badge>
        ) : (
          <Badge variant="destructive">No</Badge>
        )}
      </p>
    </CardContent>
  );
}
