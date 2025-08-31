import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

import AdminGuilds from "@/components/guild/AdminGuilds";
import UserGuilds from "@/components/guild/UserGuilds";

export default function Guilds() {
  const { isLoggedIn, user } = useAuth();
  const isAdmin = user?.is_admin || false;
  console.log(user);

  if (!isLoggedIn) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold mb-4">You are not logged in</h2>
        <p className="text-lg">Please log in to view the Guilds section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAdmin ? <AdminGuilds /> : <UserGuilds />}
    </div>
  );
}
