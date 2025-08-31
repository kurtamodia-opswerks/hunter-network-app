// components/raid/RaidHeader.jsx
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RaidHeader({ raid }) {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{raid.name}</CardTitle>
        <Badge
          variant={raid.dungeon_info.rank === "S" ? "destructive" : "outline"}
        >
          {raid.dungeon_info.rank}
        </Badge>
      </div>
      <CardDescription>{raid.date}</CardDescription>
    </CardHeader>
  );
}
