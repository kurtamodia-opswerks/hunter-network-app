// src/components/AdminHunters.jsx
import { useAuthFetch } from "../../hooks/useAuthFetch";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import HunterCard from "@/components/HunterCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import EditHunterForm from "@/components/EditHunterForm";
import { toast } from "sonner";

export default function AdminHunters() {
  const authFetch = useAuthFetch();
  const { isLoggedIn, user } = useAuth();
  const [hunters, setHunters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingHunter, setEditingHunter] = useState(null);
  const [deletingHunter, setDeletingHunter] = useState(null);

  const isAdmin = user?.is_admin || false;

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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <LoadingSkeleton key={idx} />
            ))
          : hunters.map((hunter) => (
              <HunterCard
                key={hunter.id}
                hunter={hunter}
                isAdmin={isAdmin}
                onEdit={setEditingHunter}
                onDelete={handleDelete}
                deletingHunter={deletingHunter}
                setDeletingHunter={setDeletingHunter}
              />
            ))}
      </div>

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
