import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import { useTheme } from "../context/ThemeContext";

export default function Home() {
  const { isLoggedIn, user, logoutUser } = useAuth();
  const { theme } = useTheme();

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60"
        style={{
          backgroundImage:
            theme === "light"
              ? "url('/light-mode-bg.png')"
              : "url('/dark-mode-bg.png')",
        }}
      ></div>

      {/* Overlay content */}
      <div className="relative z-10 home-container w-full h-screen flex items-center justify-center">
        <div className="flex flex-col md:flex-row items-center justify-between w-11/12 max-w-8xl">
          {/* Left side text */}
          <div className="w-full md:w-1/2 text-center md:text-left p-6">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Hunter Network
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Connect with fellow hunters, share your skills, and explore the
              network. Join us to become part of an amazing community.
            </p>
          </div>

          {/* Right side content */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            {isLoggedIn ? (
              <div className="text-center bg-white dark:bg-black p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold mb-4">
                  Welcome back, {user.username}!
                </h1>
                <p className="text-lg">
                  Explore the Hunters section to see all members.
                </p>
                <Button
                  onClick={logoutUser}
                  variant="destructive"
                  className="mt-6"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <LoginForm />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
