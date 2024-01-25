// components/Navbar.tsx
'use client'
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MenuButton from "./MenuButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function Navbar() {
    const { user, error, isLoading } = useUser();


    return (
        <div className="h-12">
            <div className="flex items-center container mx-auto max-w-screen-lg my-2">
                <Link href="/" className="font-mono ml-2 flex-grow">Habit Tracker</Link>
                <div className="mr-2 font-mono">
                    <DropdownMenu>
                        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                {(!user)
                                    ? <MenuButton value="Login" link="/api/auth/login" />
                                    : <MenuButton value="Logout" link="/api/auth/logout" />}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><MenuButton value="Track" link="/track" /></DropdownMenuItem>
                            <DropdownMenuItem><MenuButton value="Manage" link="/manage" /></DropdownMenuItem>
                            <DropdownMenuItem><MenuButton value="Statistics" link="/statistics" /></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <div className="container mx-auto max-w-screen-lg">
                <Separator className="h-0.5 bg-slate-200 my-2" />
            </div>
        </div>
    );
};
