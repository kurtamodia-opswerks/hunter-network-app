import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import HunterCard from "@/components/hunter/HunterCard";
import EditHunterForm from "@/components/hunter/EditHunterForm";
import LoadingSkeleton from "@/components/LoadingSkeleton";
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
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function AdminHunters() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHunter, setSelectedHunter] = useState(null);
  const [editingHunter, setEditingHunter] = useState(null);
  const [deletingHunter, setDeletingHunter] = useState(null);

  const isAdmin = user?.is_admin || false;
  const navigate = useNavigate();

  // Fetch hunters
  useEffect(() => {
    const loadHunters = async () => {
      setLoading(true);
      const response = await authFetch("http://localhost:8000/api/hunters/", {
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setHunters(data);
      } else {
        console.error("Failed to load hunters");
      }
      setLoading(false);
    };
    if (isLoggedIn) loadHunters();
  }, [isLoggedIn]);

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
      {loading ? (
        Array.from({ length: 6 }).map((_, idx) => <LoadingSkeleton key={idx} />)
      ) : (
        <Table className="max-w-4xl mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">First Name</TableHead>
              <TableHead className="text-center">Last Name</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hunters.map((hunter) => (
              <TableRow key={hunter.id} className="text-center">
                <TableCell className="text-center">
                  {hunter.first_name}
                </TableCell>
                <TableCell className="text-center">
                  {hunter.last_name}
                </TableCell>
                <TableCell className="text-center">
                  {hunter.rank_display}
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
