import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Hunters from "./pages/Hunters";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Guilds from "./pages/Guilds";
import GuildPage from "./pages/GuildPage";
import Raids from "./pages/Raids";
import Dungeons from "./pages/Dungeons";
import Skills from "./pages/Skills";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/hunters" element={<Hunters />} />
        <Route path="/guilds" element={<Guilds />} />
        <Route path="/guilds/:id" element={<GuildPage />} />
        <Route path="/raids" element={<Raids />} />
        <Route path="/dungeons" element={<Dungeons />} />
        <Route path="/skills" element={<Skills />} />
      </Route>
    </Routes>
  );
}

export default App;
