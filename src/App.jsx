import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Hunters from "./pages/Hunters";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Guilds from "./pages/Guilds";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/hunters" element={<Hunters />} />
        <Route path="/guilds" element={<Guilds />} />
      </Route>
    </Routes>
  );
}

export default App;
