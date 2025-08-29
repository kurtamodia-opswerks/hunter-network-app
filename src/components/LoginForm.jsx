import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ use your custom hook

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const navigate = useNavigate();
  const { loginUser } = useAuth(); // ✅ from AuthProvider
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const success = await loginUser(username, password);

    setLoading(false);

    if (success) {
      navigate("/hunters"); // redirect after login success
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-row justify-between mt-4">
          <CardAction>
            <Button type="submit" className="w-50" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardAction>
          <CardAction>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </CardAction>
        </CardFooter>
      </form>
    </Card>
  );
}
