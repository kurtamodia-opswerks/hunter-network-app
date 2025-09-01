import { useAuth } from "@/context/AuthContext";
import AdminRaids from "@/components/raid/admin/AdminRaids";
import UserRaids from "@/components/raid/non-admin/UserRaids";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRaidsApi } from "@/api/raidsApi";

export default function Raids() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.is_admin || false;

  const { getRaids, getParticipations } = useRaidsApi();

  const [raids, setRaids] = useState([]);
  const [loadingRaids, setLoadingRaids] = useState(true);

  const [participations, setParticipations] = useState([]);
  const [loadingParticipations, setLoadingParticipations] = useState(true);

  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState("");

  const loadRaids = async () => {
    setLoadingRaids(true);
    try {
      const data = await getRaids({ search, ordering });
      setRaids(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching raids");
    } finally {
      setLoadingRaids(false);
    }
  };

  const loadParticipations = async () => {
    if (!isAdmin) {
      setLoadingParticipations(true);
      try {
        const data = await getParticipations();
        setParticipations(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load participations");
      } finally {
        setLoadingParticipations(false);
      }
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
