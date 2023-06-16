import { Box, Container, Typography } from "@mui/material";
import LoginButton from "../components/login";
import { useAuth0 } from "@auth0/auth0-react";

export default function LandingPage() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    return(
        <Container maxWidth="sm">
            <Box sx={{ mt: "100px"}}>
                { isAuthenticated 
                    ? <Typography variant="h1">Welcome {user.name}!</Typography>
                    : <Typography variant="h1">Welcome, please log in!</Typography>
                }
               
            </Box>
        </Container>
    )
}