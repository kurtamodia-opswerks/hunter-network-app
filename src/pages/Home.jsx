import LoginForm from "@/components/LoginForm";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { isLoggedIn, user, logoutUser } = useAuth();
  console.log(user);
  return (
    <>
      <div className="home-container w-full h-screen flex justify-center items-center">
        {isLoggedIn ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Welcome back, {user.username}!
            </h1>
            <p className="text-lg">
              Explore the Hunters section to see all members.
            </p>
            <Button onClick={logoutUser} variant="destructive" className="mt-6">
              Logout
            </Button>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </>
  );
}
