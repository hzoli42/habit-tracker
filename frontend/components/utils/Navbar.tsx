// components/Navbar.tsx
'use client'
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Navbar, Tooltip, Typography } from "@material-tailwind/react";
import TimerIcon from '@mui/icons-material/Timer';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Button } from "../ui/button";
import { useViewport } from "@/lib/hooks";
import MenuIcon from '@mui/icons-material/Menu';
import { StethoscopeIcon } from "lucide-react";
import { useState } from "react";


export default function AppNavbar() {
    const { user, error, isLoading } = useUser()
    const { width, height } = useViewport()
    const [open, setOpen] = useState(false)

    function desktopMenu() {
        return (
            <div className="flex justify-center gap-6 items-center">
                <Link href="/track">
                    <Typography variant="h6" className="flex gap-2 text-black">
                        <TimerIcon className="fill-black" />
                        Track
                    </Typography>
                </Link>
                <Link href="/manage">
                    <Typography variant="h6" className="flex gap-2 text-black">
                        <EditIcon className="fill-black" />
                        Manage
                    </Typography>
                </Link>
                <Link href="/analyse">
                    {/* <Tooltip content="Coming soon!" className="border-2 bg-white text-gray-500"> */}
                    <Typography variant="h6" className="flex gap-2 text-black">
                        <TrendingUpIcon />
                        Analyse
                    </Typography>
                    {/* </Tooltip> */}
                </Link>

                <a href="/api/auth/logout">
                    <Button variant="outline" className="bg-black hover:bg-black hover:opacity-75 border-2 border-black ms-4">
                        <Typography variant="h6" className="text-white">
                            Log out
                        </Typography>
                    </Button>
                </a>
            </div>
        )
    }

    function mobileMenu() {
        return (
            <div className="flex justify-center gap-6 items-center">
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger className="text-black text-lg">
                        <MenuIcon fontSize="large" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <Link href="/track" onClick={() => setOpen(false)}>
                            <Typography variant="h6" className="flex gap-2 text-black py-2">
                                <TimerIcon className="fill-black" />
                                Track
                            </Typography>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href="/manage" onClick={() => setOpen(false)}>
                            <Typography variant="h6" className="flex gap-2 text-black py-2">
                                <EditIcon className="fill-black" />
                                Manage
                            </Typography>
                        </Link>
                        <DropdownMenuSeparator />
                        <Link href="/analyse" onClick={() => setOpen(false)}>
                            {/* <Tooltip content="Coming soon!" className="border-2 bg-white text-gray-500"> */}
                            <Typography variant="h6" className="flex gap-2 text-black py-2">
                                <TrendingUpIcon />
                                Analyse
                            </Typography>
                            {/* </Tooltip> */}
                        </Link>
                        <DropdownMenuSeparator className="my-2" />
                        <a href="/api/auth/logout" onClick={() => setOpen(false)}>
                            <Typography variant="h6" className="text-red-600 flex justify-center py-2">
                                Log out
                            </Typography>
                        </a>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        )
    }

    return (
        <Navbar className="mx-auto max-w-screen-lg p-4 shadow-md">
            <div className="flex justify-between items-center">
                <Link href="/">
                    <Typography variant="h5" className="text-black pt-1">
                        Habit Tracker
                    </Typography>
                </ Link>
                {isLoading && <></>}
                {!isLoading && user?.sub === undefined && (
                    <div className="flex justify-center gap-6">
                        <a href="/api/auth/login">
                            <Button variant="outline" className="bg-whiteborder-2 border-black">
                                <Typography variant="h6" className="text-black">
                                    Log in
                                </Typography>
                            </Button>
                        </a>
                        <a href="/api/auth/login?signup=true">
                            <Button variant="outline" className="bg-black hover:bg-black hover:opacity-75 border-2 border-black">
                                <Typography variant="h6" className="text-white">
                                    Sign up
                                </Typography>
                            </Button>
                        </a>
                    </div>
                )}
                {width > 700 && !isLoading && user?.sub !== undefined && desktopMenu()}
                {width <= 700 && !isLoading && user?.sub !== undefined && mobileMenu()}

            </div>
        </Navbar>
    )
};
