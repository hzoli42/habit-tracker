import {Container, Card, CardContent, Typography, Box} from '@mui/material'
import axios from 'axios';
import { Session } from '../../models/session';
import SessionCard from './sessioncard';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export default function Dashboard() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const { user, isAuthenticated, isLoading } = useAuth0();

    
    async function updateSessions() {
        await axios.get(`http://0.0.0.0:80/sessions/${user.sub}`)
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
        if (isAuthenticated) {
            updateSessions();
        }
    }, [isAuthenticated]);
    
    return (
        <Container maxWidth='md'>
            {isAuthenticated &&
                <Box sx={{mt: '10px'}}>
                {
                    sessions.map((s, idx) => {
                        return (<SessionCard key={idx} {...s}/>);
                    })
                }
                </Box>
            }
        </Container>
    );

}