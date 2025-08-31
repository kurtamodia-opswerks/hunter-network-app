// src/pages/Hunters.jsx
import { useAuth } from "@/context/AuthContext";
import AdminHunters from "@/components/hunter/AdminHunters";
import UserHunters from "@/components/hunter/UserHunters";

export default function Hunters() {
  const { user } = useAuth();
  const isAdmin = user?.is_admin || false;

  return isAdmin ? <AdminHunters /> : <UserHunters />;
}
