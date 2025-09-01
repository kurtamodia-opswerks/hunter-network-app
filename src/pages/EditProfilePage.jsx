// src/pages/profile/EditProfilePage.jsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHuntersApi } from "@/api/huntersApi";
import { useFetchSkillsAndGuilds } from "@/hooks/useFetchSkillsAndGuilds";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function EditProfilePage() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { getHunter, updateHunter } = useHuntersApi();
  const { skills, guilds, loading: loadingOptions } = useFetchSkillsAndGuilds();

  const [hunter, setHunter] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    guild: null,
    skills: [],
    rank: "E",
  });

  // Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // Load user profile
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const data = await getHunter(user.user_id);
        setHunter(data);
        setFormData({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          username: data.username || "",
          email: data.email || "",
          password: "",
          guild: data.guild || null,
          skills: data.skills || [],
          rank: data.rank || "E",
        });
      } catch (err) {
        console.error(err);
        toast.error("Error loading profile");
      }
      setLoading(false);
    };

    loadProfile();
  }, [isLoggedIn, user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSelectChange = (field, value) =>
    setFormData({ ...formData, [field]: value });

  const handleMultiSelect = (skillId) =>
    setFormData((prev) => {
      const exists = prev.skills.includes(skillId);
      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((s) => s !== skillId)
          : [...prev.skills, skillId],
      };
    });

  const handleSaveClick = (e) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      // Verify password before updating profile
      const verifyRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/verify-password/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: confirmPassword }),
        }
      );

      if (!verifyRes.ok) throw new Error("Failed to verify password");
      const verifyData = await verifyRes.json();
      if (!verifyData.valid) throw new Error("Incorrect password");

      // Update profile
      const payload = {
        ...formData,
        password: formData.password || undefined,
        guild: formData.guild ? Number(formData.guild) : null,
        skills: formData.skills.map(Number),
      };

      const updated = await updateHunter(hunter.id, payload);
      setHunter(updated);
      toast.success("Profile updated successfully!");
      setConfirmOpen(false);
      setConfirmPassword("");
      navigate(-1);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Error updating profile");
    }
  };

  if (loading || loadingOptions)
    return <p className="text-center mt-20">Loading profile...</p>;
  if (!hunter) return <p className="text-center mt-20">Profile not found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Edit Profile</CardTitle>
          <CardDescription className="text-center">
            Update your hunter profile information below.
          </CardDescription>
        </CardHeader>

        <form>
          <CardContent className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep unchanged"
              />
            </div>

            {/* Rank */}
            <div className="space-y-2">
              <Label>Rank</Label>
              <Select
                value={formData.rank}
                onValueChange={(val) => handleSelectChange("rank", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rank" />
                </SelectTrigger>
                <SelectContent>
                  {["S", "A", "B", "C", "D", "E"].map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guild */}
            <div className="space-y-2 col-span-2">
              <Label>Guild</Label>
              <Select
                value={formData.guild ? String(formData.guild) : ""}
                onValueChange={(val) =>
                  handleSelectChange("guild", val === "" ? null : Number(val))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select guild" />
                </SelectTrigger>
                <SelectContent>
                  {guilds.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skills */}
            <div className="space-y-2 col-span-2">
              <Label>Skills</Label>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Button
                    key={s.id}
                    type="button"
                    variant={
                      formData.skills.includes(s.id) ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleMultiSelect(s.id)}
                  >
                    {s.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button type="button" onClick={handleSaveClick}>
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Confirm Password Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Password</DialogTitle>
            <DialogDescription>
              Enter your current password to save changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-4">
            <Label htmlFor="confirmPassword">Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button onClick={handleConfirmSubmit}>Confirm</Button>
            <Button
              variant="outline"
              onClick={() => {
                setConfirmOpen(false);
                setConfirmPassword("");
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
