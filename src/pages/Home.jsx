import { GalleryVerticalEnd } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";

export default function Home() {
  const { isLoggedIn, user, logoutUser } = useAuth();
  const { theme } = useTheme();
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    logoutUser();
    toast.success("You have logged out successfully");
    setOpenLogoutDialog(false);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Hunter Network
          </a>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLoggedIn ? (
              <div className="text-center bg-white dark:bg-black p-6 rounded-xl shadow-lg">
                <h1 className="text-xl font-bold mb-2">
                  Welcome back, {user.username}!
                </h1>
                <p className="text-sm text-muted-foreground">
                  Explore the Hunters section to see all members.
                </p>
                <AlertDialog
                  open={openLogoutDialog}
                  onOpenChange={setOpenLogoutDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="mt-4 w-full">
                      Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to log out?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Logout
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <LoginForm />
            )}
          </div>
        </div>
      </div>

      {/* Right side image */}
      <div className="bg-muted relative hidden lg:block">
        <img
          src={theme === "light" ? "/light-mode-bg.png" : "/dark-mode-bg.png"}
          alt="Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
