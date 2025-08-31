// components/raid/UserParticipationsTable.jsx
import { useEffect, useState } from "react";
import { useAuthFetch } from "../../hooks/useAuthFetch";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function UserParticipationsTable() {
  const authFetch = useAuthFetch();
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadParticipations = async () => {
    setLoading(true);
    try {
      const res = await authFetch(
        "http://localhost:8000/api/raid-participations/"
      );
      if (res.ok) {
        setParticipations(await res.json());
      } else {
        toast.error("Failed to load your participations");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading participations");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadParticipations();
  }, []);

  if (loading) return <p>Loading your participations...</p>;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-bold mb-2">My Raid Participations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Raid</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Dungeon</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participations.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.raid.name}</TableCell>
              <TableCell>{p.role}</TableCell>
              <TableCell>{p.raid.date}</TableCell>
              <TableCell>{p.raid.dungeon_info.name}</TableCell>
              <TableCell>{p.raid.success ? "Success" : "Failed"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
