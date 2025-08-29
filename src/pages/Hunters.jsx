import { useAuthFetch } from "../hooks/useAuthFetch";

export default function Hunters() {
  const authFetch = useAuthFetch();

  const loadHunters = async () => {
    const response = await authFetch("http://localhost:8000/api/hunters/");
    if (response.ok) {
      const data = await response.json();
      console.log(data);
    }
  };

  return <button onClick={loadHunters}>Load Hunters</button>;
}
