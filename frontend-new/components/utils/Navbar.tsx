// components/Navbar.tsx
'use client'
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import MenuButton from "./MenuButton";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Navbar, Typography } from "@material-tailwind/react";
import TimerIcon from '@mui/icons-material/Timer';
import EditIcon from '@mui/icons-material/Edit';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Button } from "../ui/button";


export default function AppNavbar() {
    const { user, error, isLoading } = useUser();

    return (
        <Navbar className="mx-auto max-w-screen-lg p-4">
            <div className="flex justify-between items-center">
                <Typography as="a" href="/" variant="h5" className="text-black">
                    Habit Tracker
                </Typography>
                {
                    user?.sub === undefined
                        ? (
                            <div className="flex justify-center gap-6">
                                <a href="/api/auth/login">
                                    <Button variant="outline" className="bg-whiteborder-2 border-black">
                                        <Typography variant="h6" className="text-black">
                                            Login
                                        </Typography>
                                    </Button>
                                </a>
                                <a href="/api/auth/login?signup=true">
                                    <Button variant="outline" className="bg-black hover:bg-black hover:opacity-75 border-2 border-black">
                                        <Typography variant="h6" className="text-white">
                                            Signup
                                        </Typography>
                                    </Button>
                                </a>
                            </div>
                        )
                        : (
                            <div className="flex justify-center gap-6">
                                <Typography as="a" href="/track" variant="h6" className="flex gap-2 text-black">
                                    <TimerIcon className="fill-black" />
                                    Track
                                </Typography>
                                <Typography as="a" href="/manage" variant="h6" className="flex gap-2 text-black">
                                    <EditIcon className="fill-black" />
                                    Manage
                                </Typography>
                                <Typography as="a" href="/statistics" variant="h6" className=" flex gap-2 text-black">
                                    <TrendingUpIcon className="fill-black" />
                                    Analyse
                                </Typography>
                            </div>
                        )
                }

            </div>
        </Navbar>
    )
};
