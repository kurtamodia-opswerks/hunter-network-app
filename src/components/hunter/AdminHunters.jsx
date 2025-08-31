import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import HunterCard from "@/components/hunter/HunterCard";
import EditHunterForm from "@/components/hunter/EditHunterForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Check, CircleX } from "lucide-react";

export default function AdminHunters() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHunter, setEditingHunter] = useState(null);
  const [deletingHunter, setDeletingHunter] = useState(null);

  // Sorting & search state
  const [ordering, setOrdering] = useState("first_name"); // default sort
  const [search, setSearch] = useState("");

  const isAdmin = user?.is_admin || false;
  const navigate = useNavigate();

  // Fetch hunters with ordering & search
  useEffect(() => {
    const loadHunters = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (ordering) params.append("ordering", ordering);
        if (search) params.append("search", search);

        const url = `http://localhost:8000/api/hunters/?${params.toString()}`;
        const response = await authFetch(url, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setHunters(data);
        } else {
          toast.error("Failed to load hunters");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load hunters");
      }
      setLoading(false);
    };

    if (isLoggedIn) loadHunters();
  }, [isLoggedIn, ordering, search]);

  const handleDelete = async (hunterId) => {
    const response = await authFetch(
      `http://localhost:8000/api/hunters/${hunterId}/`,
      { method: "DELETE" }
    );
    if (response.ok) {
      setHunters((prev) => prev.filter((h) => h.id !== hunterId));
      toast.success("Hunter deleted successfully");
    } else {
      toast.error("Failed to delete hunter");
    }
    setDeletingHunter(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
        <p className="text-lg">Please log in to view the Hunters section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls: Search + Sorting */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2 md:justify-end mb-2">
        <Input
          placeholder="Search hunters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-64"
        />
        <Select value={ordering} onValueChange={setOrdering}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Sort hunters by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="first_name">First Name ↑</SelectItem>
            <SelectItem value="-first_name">First Name ↓</SelectItem>
            <SelectItem value="last_name">Last Name ↑</SelectItem>
            <SelectItem value="-last_name">Last Name ↓</SelectItem>
            <SelectItem value="rank">Rank ↑</SelectItem>
            <SelectItem value="-rank">Rank ↓</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hunters Table */}
      {loading ? (
        <></>
      ) : (
        <Table className="max-w-4xl mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">First Name</TableHead>
              <TableHead className="text-center">Last Name</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="text-center">Guild</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hunters.map((hunter) => (
              <TableRow key={hunter.id} className="text-center">
                <TableCell>{hunter.first_name}</TableCell>
                <TableCell>{hunter.last_name}</TableCell>
                <TableCell>{hunter.rank_display}</TableCell>
                <TableCell>
                  {hunter.guild ? (
                    <Check className="mx-auto text-green-500" />
                  ) : (
                    <CircleX className="mx-auto text-red-500" />
                  )}
                </TableCell>
                <TableCell className="flex justify-center space-x-5">
                  {/* View Details */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/hunters/${hunter.id}`)}
                      >
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <HunterCard hunter={hunter} isAdmin={isAdmin} />
                    </DialogContent>
                  </Dialog>

                  {/* Edit */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingHunter(hunter)}
                  >
                    Edit
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      setDeletingHunter(hunter.id) || handleDelete(hunter.id)
                    }
                    disabled={deletingHunter === hunter.id}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Edit Hunter Modal */}
      {editingHunter && (
        <EditHunterForm
          hunter={editingHunter}
          onClose={() => setEditingHunter(null)}
          onUpdated={(updated) =>
            setHunters((prev) =>
              prev.map((h) => (h.id === updated.id ? updated : h))
            )
          }
        />
      )}
    </div>
  );
}
