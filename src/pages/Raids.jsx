import { useAuth } from "@/context/AuthContext";
import AdminRaids from "@/components/raid/AdminRaids";
import UserRaids from "@/components/raid/UserRaids";

export default function Raids() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.is_admin || false;

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-2">You are not logged in</h2>
        <p>Please log in to see raids and your participations.</p>
      </div>
    );
  }

  return isAdmin ? <AdminRaids /> : <UserRaids />;
}
