import { Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import HomePage from "../components/home/home";

export default function LandingPage() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    return(
        <>
        { 
            isAuthenticated 
            ? <HomePage />
            : <Typography variant="h1">Welcome, please log in!</Typography>
        }
        </>
    )
}