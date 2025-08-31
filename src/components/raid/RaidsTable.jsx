// components/raid/RaidsTable.jsx
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function RaidsTable({ isAdmin, onEdit, onDelete }) {
  const authFetch = useAuthFetch();
  const [raids, setRaids] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRaids = async () => {
    setLoading(true);
    try {
      const res = await authFetch("http://localhost:8000/api/raids/", {
        cache: "no-store",
      });
      if (res.ok) setRaids(await res.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load raids");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadRaids();
  }, []);

  if (loading) return <p>Loading raids...</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Dungeon</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Team Strength</TableHead>
          <TableHead>Success</TableHead>
          {isAdmin && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {raids.map((raid) => (
          <TableRow key={raid.id}>
            <TableCell>{raid.name}</TableCell>
            <TableCell>{raid.dungeon_info.name}</TableCell>
            <TableCell>{raid.date}</TableCell>
            <TableCell>{raid.team_strength}</TableCell>
            <TableCell>
              {raid.success ? (
                <span className="text-green-600 font-semibold">Yes</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )}
            </TableCell>
            {isAdmin && (
              <TableCell className="flex gap-2">
                <Button size="sm" onClick={() => onEdit(raid)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(raid.id)}
                >
                  Delete
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
