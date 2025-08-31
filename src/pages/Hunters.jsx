// src/pages/Hunters.jsx
import { useAuth } from "../context/AuthContext";
import AdminHunters from "@/components/subpages/AdminHunters";
import UserHunters from "@/components/subpages/UserHunters";

export default function Hunters() {
  const { user } = useAuth();
  const isAdmin = user?.is_admin || false;

  return isAdmin ? <AdminHunters /> : <UserHunters />;
}
