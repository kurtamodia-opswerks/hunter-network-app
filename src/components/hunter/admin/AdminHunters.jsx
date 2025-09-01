import { useState } from "react";
import { useHuntersApi } from "@/api/huntersApi";
import EditHunterForm from "@/components/hunter/admin/EditHunterForm";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { useNavigate } from "react-router-dom";
import { Check, CircleX } from "lucide-react";

export default function AdminHunters({
  hunters,
  skills,
  guilds,
  setHunters,
  loading,
  search,
  setSearch,
  ordering,
  setOrdering,
}) {
  const authFetch = useAuthFetch();
  const { deleteHunter } = useHuntersApi();
  const [editingHunter, setEditingHunter] = useState(null);
  const [deletingHunter, setDeletingHunter] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (hunterId) => {
    try {
      await deleteHunter(hunterId);
      setHunters((prev) => prev.filter((h) => h.id !== hunterId));
      toast.success("Hunter deleted successfully");
    } catch {
      toast.error("Failed to delete hunter");
    }
    setDeletingHunter(null);
  };

  return (
    <div className="space-y-4">
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

      {loading ? null : (
        <Table className="max-w-4xl mx-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Hunter ID</TableHead>
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
                <TableCell>{hunter.id}</TableCell>
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/hunters/${hunter.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingHunter(hunter)}
                  >
                    Edit
                  </Button>
                  <AlertDialog
                    open={deletingHunter === hunter.id}
                    onOpenChange={(open) => {
                      if (!open) setDeletingHunter(null);
                    }}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingHunter(hunter.id)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Hunter</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete{" "}
                          <span className="font-semibold">
                            {hunter.first_name} {hunter.last_name}
                          </span>
                          ? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(hunter.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {editingHunter && (
        <EditHunterForm
          hunter={editingHunter}
          skills={skills}
          guilds={guilds}
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
