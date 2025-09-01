// src/hooks/useSkillsAndGuilds.js
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthFetch } from "@/hooks/useAuthFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // use the env variable

export function useFetchSkillsAndGuilds() {
  const { isLoggedIn } = useAuth();
  const authFetch = useAuthFetch();

  const [skills, setSkills] = useState([]);
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchOptions = async () => {
      setLoading(true);
      try {
        const [skillRes, guildRes] = await Promise.all([
          authFetch(`${API_BASE_URL}/skills/`, { cache: "no-store" }),
          authFetch(`${API_BASE_URL}/guilds/`, { cache: "no-store" }),
        ]);

        if (skillRes.ok) {
          setSkills(await skillRes.json());
        }
        if (guildRes.ok) {
          setGuilds(await guildRes.json());
        }
      } catch (err) {
        console.error("Error fetching skills/guilds:", err);
      }
      setLoading(false);
    };

    fetchOptions();
  }, [isLoggedIn]);

  return { skills, guilds, loading };
}
