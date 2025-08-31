import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GalleryVerticalEnd } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const { isLoggedIn, user } = useAuth();

  return (
    <>
      <NavigationMenu className="w-full p-2">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link to="/" className="flex items-center gap-2 font-medium ">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Hunter Network
            <Separator
              orientation="vertical"
              className="w-2 h-16 bg-gray-400"
            />
          </Link>
        </div>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/hunters">Hunters</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/guilds">Guilds</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/raids">Raids</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/dungeons">Dungeons</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/skills">Skills</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="absolute top-4 right-4 flex items-center space-x-4">
        {isLoggedIn && user && (
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
        )}
        <DarkModeToggle />
      </div>
    </>
  );
}
