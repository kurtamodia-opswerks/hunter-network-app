import { useAuth } from "@/context/AuthContext";
import AdminRaids from "@/components/raid/AdminRaids";
import UserRaids from "@/components/raid/UserRaids";
import { useState, useEffect } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";

export default function Raids() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.is_admin || false;

  const authFetch = useAuthFetch();

  // Lifted states
  const [raids, setRaids] = useState([]);
  const [loadingRaids, setLoadingRaids] = useState(true);

  // For user participations
  const [participations, setParticipations] = useState([]);
  const [loadingParticipations, setLoadingParticipations] = useState(true);

  // Search & ordering (Admin only)
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");

  const loadRaids = async () => {
    setLoadingRaids(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (ordering) params.append("ordering", ordering);

      const res = await authFetch(
        `http://localhost:8000/api/raids/?${params.toString()}`,
        { cache: "no-store" }
      );
      if (res.ok) setRaids(await res.json());
      else toast.error("Failed to load raids");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching raids");
    }
    setLoadingRaids(false);
  };

  const loadParticipations = async () => {
    if (!isAdmin) {
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
    }
  };

  useEffect(() => {
    loadRaids();
    loadParticipations();
  }, [search, ordering]);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-2">You are not logged in</h2>
        <p>Please log in to see raids and your participations.</p>
      </div>
    );
  }

  return isAdmin ? (
    <AdminRaids
      raids={raids}
      setRaids={setRaids}
      loadingRaids={loadingRaids}
      search={search}
      setSearch={setSearch}
      ordering={ordering}
      setOrdering={setOrdering}
      authFetch={authFetch}
    />
  ) : (
    <UserRaids
      raids={raids}
      participations={participations}
      loadingRaids={loadingRaids}
      loadingParticipations={loadingParticipations}
    />
  );
}
