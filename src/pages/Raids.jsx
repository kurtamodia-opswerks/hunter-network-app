import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useAuthFetch } from "../hooks/useAuthFetch";
import { toast } from "sonner";

import RaidCard from "@/components/raid/RaidCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import RaidParticipationsForm from "@/components/raid/RaidParticipationForm"; // reuse form for edit

export default function RaidsPage() {
  const { isLoggedIn, user } = useAuth();
  const authFetch = useAuthFetch();

  const [raids, setRaids] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loadingRaids, setLoadingRaids] = useState(true);
  const [loadingParticipations, setLoadingParticipations] = useState(true);

  const [editingParticipation, setEditingParticipation] = useState(null);
  const [deletingParticipation, setDeletingParticipation] = useState(null);

  const isAdmin = user?.is_admin || false;

  // Load all raids
  const loadRaids = async () => {
    setLoadingRaids(true);
    try {
      const res = await authFetch("http://localhost:8000/api/raids/", {
        cache: "no-store",
      });
      if (res.ok) setRaids(await res.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load raids");
    }
    setLoadingRaids(false);
  };

  // Load user's participations
  const loadParticipations = async () => {
    setLoadingParticipations(true);
    try {
      const res = await authFetch(
        "http://localhost:8000/api/raid-participations/",
        { cache: "no-store" }
      );
      if (res.ok) setParticipations(await res.json());
    } catch (err) {
      console.error(err);
      toast.error("Failed to load participations");
    }
    setLoadingParticipations(false);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadRaids();
      loadParticipations();
    }
  }, [isLoggedIn]);

  const handleDeleteParticipation = async (participationId) => {
    try {
      const res = await authFetch(
        `http://localhost:8000/api/raid-participations/${participationId}/`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setParticipations((prev) =>
          prev.filter((p) => p.id !== participationId)
        );
        toast.success("Participation removed!");
      } else {
        toast.error("Failed to remove participation");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing participation");
    }
    setDeletingParticipation(null);
  };

  const handleEditParticipation = async (participationId, updatedData) => {
    try {
      const res = await authFetch(
        `http://localhost:8000/api/raid-participations/${participationId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      if (res.ok) {
        const updatedParticipation = await res.json();
        setParticipations((prev) =>
          prev.map((p) =>
            p.id === updatedParticipation.id ? updatedParticipation : p
          )
        );
        toast.success("Participation updated!");
      } else {
        toast.error("Failed to update participation");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating participation");
    }
    setEditingParticipation(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-2">You are not logged in</h2>
        <p>Please log in to see raids and your participations.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
      {/* All Raids Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">All Raids</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
          {loadingRaids
            ? Array.from({ length: 4 }).map((_, idx) => (
                <LoadingSkeleton key={idx} />
              ))
            : raids.map((raid) => (
                <RaidCard
                  key={raid.id}
                  raid={raid}
                  isAdmin={isAdmin}
                  // optionally pass onEdit/onDelete
                />
              ))}
        </div>
      </section>

      {/* My Participations Section */}
      <section>
        <h2 className="text-xl font-bold mb-4">My Participations</h2>
        {loadingParticipations ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <LoadingSkeleton key={idx} />
          ))
        ) : participations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have not joined any raids yet.
          </p>
        ) : (
          <div className="grid gap-4">
            {participations.map((p) => {
              const raid = raids.find((r) => r.id === p.raid_id);
              if (!raid) return null;

              return (
                <RaidCard
                  key={p.id}
                  raid={raid}
                  readOnly={true} // hide actions
                />
              );
            })}
          </div>
        )}
      </section>

      {/* Edit Participation Modal */}
      {editingParticipation && (
        <RaidParticipationsForm
          raidId={editingParticipation.raid.id}
          onClose={() => setEditingParticipation(null)}
          onAdded={(updated) =>
            handleEditParticipation(editingParticipation.id, updated)
          }
        />
      )}
    </div>
  );
}
