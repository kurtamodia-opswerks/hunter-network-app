import LoginForm from "@/components/LoginForm";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Home() {
  const { isLoggedIn, user } = useContext(AuthContext);
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
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </>
  );
}
