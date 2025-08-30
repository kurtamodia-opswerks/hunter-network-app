import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function Layout() {
  return (
    <div className="app-container w-full mx-auto min-h-screen flex flex-col">
      <Toaster position="top-right" richColors />
      <Navbar />
      <main className="main-content w-full min-h-screen p-4">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
