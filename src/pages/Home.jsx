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

      {/* Right side text section with background */}
      <div className="relative hidden lg:flex items-center justify-center p-10 text-center">
        {/* Text content */}
        <div className="relative max-w-lgflex flex-col items-center gap-6">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance border-b pb-2">
            <span className="text-teal-800">Hunter Network:</span> Your Gateway
            to the Hunter Community
          </h1>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Connect, collaborate, and conquer challenges together in the world
            of hunters.
          </p>
        </div>
      </div>
    </div>
  );
}
