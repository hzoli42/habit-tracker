import {Container, Card, CardContent, Typography, Box} from '@mui/material'
import axios from 'axios';
import { Session } from '../models/session';
import SessionCard from '../components/sessioncard';
import { useEffect, useState } from 'react';
import LoginButton from '../components/login';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../components/logout';

export default function Dashboard() {
    const username: string = 'zolika';
    const [sessions, setSessions] = useState<Session[]>([]);
    const { user, isAuthenticated, isLoading } = useAuth0();

    
    async function updateSessions() {
        await axios.get(`http://0.0.0.0:80/sessions/${username}`)
            .then(response => {
                console.log(response.data.sessions);
                setSessions(response.data.sessions);
            })
            .catch(error => {
                console.log(error);
                setSessions([]);
            });
        console.log(`User: ${user}, isAuthenticated: ${isAuthenticated}, isLoading: ${isLoading}`)
    }

    useEffect(() => {
        updateSessions();
    }, []);
    
    return (
        <Container maxWidth='md'>
            <LoginButton />
            <LogoutButton />
            <Box sx={{mt: '10px'}}>
            {
                sessions.map((s, idx) => {
                    const userName = user ? user.name : "Unknown"
                    return (<SessionCard key={idx} id={s.id} user={userName} actions={s.actions} />);
                })
            }
            </Box>
        </Container>
    );

}