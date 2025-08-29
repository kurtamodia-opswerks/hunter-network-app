import { useAuthFetch } from "../hooks/useAuthFetch";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Hunters() {
  const authFetch = useAuthFetch();
  const [hunters, setHunters] = useState([]);

  useEffect(() => {
    const loadHunters = async () => {
      const response = await authFetch("http://localhost:8000/api/hunters/");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched hunters:", data);
        setHunters(data);
      } else {
        console.error("Failed to load hunters");
      }
    };
    loadHunters();
  }, []);

  return (
    <div className="space-y-4">
      {/* <Button onClick={loadHunters}>Load Hunters</Button> */}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hunters.map((hunter) => (
          <Card key={hunter.id} className="shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{hunter.full_name} </CardTitle>
                {/* Badge for rank */}
                {hunter.guild && <Badge>{hunter.guild_name}</Badge>}
                <Badge
                  variant={
                    hunter.rank === "S"
                      ? "destructive"
                      : hunter.rank === "A"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {hunter.rank_display}
                </Badge>
              </div>
              <CardDescription>{hunter.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                Power Level:{" "}
                <span className="font-medium">{hunter.power_level}</span>
              </p>
              <p>
                Raid Count:{" "}
                <span className="font-medium">{hunter.raid_count}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
