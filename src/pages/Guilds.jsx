// src/pages/Guilds.jsx
import { useAuth } from "../context/AuthContext";
import AdminGuilds from "@/components/guild/AdminGuilds";
import UserGuilds from "@/components/guild/UserGuilds";

export default function Guilds() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.is_admin || false;

  if (!isLoggedIn) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
        <p className="text-lg">Please log in to view the Guilds section.</p>
      </div>
    );
  }

  return isAdmin ? <AdminGuilds /> : <UserGuilds />;
}
