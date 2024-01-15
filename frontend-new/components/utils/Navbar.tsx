// components/Navbar.tsx
'use client'
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LoginButton } from "./LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import { LogoutButton } from "./LogoutButton";

export default function Navbar() {
    const { isAuthenticated } = useAuth0();

  return (
    <div className="h-12">
        <div className="flex items-center container mx-auto max-w-screen-lg my-2">
            <Link href="/" className="font-mono ml-2 flex-grow">Habit Tracker</Link>
            <div className="mr-2 font-mono">
                {/* <DropdownMenu>
                    <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem><LoginButton /></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem><button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>Logout</button></DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
                <LoginButton />
                <LogoutButton />
            </div>
        </div>
        <div className="container mx-auto max-w-screen-lg">
            <Separator className="h-0.5 bg-slate-200 my-2"/>
        </div>
    </div>
  );
};
