import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content w-full min-h-screen p-4">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  );
}
