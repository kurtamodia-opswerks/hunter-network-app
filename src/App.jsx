import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Hunters from "./pages/Hunters";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="hunters" element={<Hunters />} />
      </Route>
    </Routes>
  );
}

export default App;
