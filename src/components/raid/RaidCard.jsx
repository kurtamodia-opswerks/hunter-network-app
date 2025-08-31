// RaidCard.jsx
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "sonner";
import RaidHeader from "./RaidHeader";
import RaidInfo from "./RaidInfo";
import RaidParticipations from "./RaidParticipations";
import RaidActions from "./RaidActions";

export default function RaidCard({
  raid,
  isAdmin,
  onEdit,
  onDelete,
  setDeletingRaid,
  readOnly = false,
}) {
  const { user } = useAuth();
  const authFetch = useAuthFetch();

  const [participations, setParticipations] = useState(
    raid.participations_info || []
  );
  const [loadingAction, setLoadingAction] = useState(false);

  const userParticipation = useMemo(() => {
    return participations.find((p) => p.hunter_id === Number(user?.user_id));
  }, [participations, user]);

  const handleJoinRaid = async () => {
    if (!user) return toast.error("You must be logged in to join a raid.");
    setLoadingAction(true);
    try {
      const response = await authFetch(
        "http://localhost:8000/api/raid-participations/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            raid: raid.id,
            hunter: user.user_id,
            role: "DPS",
          }),
        }
      );

      if (response.ok) {
        const newParticipation = await response.json();
        setParticipations((prev) => [...prev, newParticipation]);
        toast.success("You joined the raid!");
      } else if (response.status === 400) {
        toast.error("You have already joined this raid.");
      } else {
        toast.error("Failed to join the raid.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while joining.");
    }
    setLoadingAction(false);
  };

  const handleLeaveRaid = async () => {
    if (!userParticipation) return;
    setLoadingAction(true);
    try {
      const response = await authFetch(
        `http://localhost:8000/api/raid-participations/${userParticipation.id}/`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setParticipations((prev) =>
          prev.filter((p) => p.id !== userParticipation.id)
        );
        toast.success("You left the raid.");
      } else {
        toast.error("Failed to leave the raid.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while leaving.");
    }
    setLoadingAction(false);
  };

  return (
    <Card className="shadow-md">
      <RaidHeader raid={raid} />
      <RaidInfo raid={raid} />

      {/* Only show actions if not readOnly */}
      {!readOnly && (
        <div className="flex space-x-2 mt-3 p-4">
          <RaidParticipations
            participations={participations}
            setParticipations={setParticipations}
            raidId={raid.id}
            isAdmin={isAdmin}
          />

          <RaidActions
            raid={raid}
            isAdmin={isAdmin}
            userParticipation={userParticipation}
            loadingAction={loadingAction}
            onEdit={onEdit}
            onDelete={onDelete}
            setDeletingRaid={setDeletingRaid}
            handleJoinRaid={handleJoinRaid}
            handleLeaveRaid={handleLeaveRaid}
          />
        </div>
      )}
    </Card>
  );
}
