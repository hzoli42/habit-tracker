import { Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import TrackPage from "../components/home/track";

export default function LandingPage() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    return(
        <>
        { 
            isAuthenticated 
            ? <TrackPage />
            : <Typography variant="h1">Welcome, please log in!</Typography>
        }
        </>
    )
}