import {Container, Card, CardContent, Typography, Box} from '@mui/material'
import axios from 'axios';
import { Session } from '../models/session';
import SessionCard from '../components/sessioncard';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const user: string = 'zolika';
    const [sessions, setSessions] = useState<Session[]>([]);
    
    async function updateSessions() {
        await axios.get(`http://0.0.0.0:80/sessions/${user}`)
            .then(response => {
                console.log(response.data.sessions);
                setSessions(response.data.sessions);
            })
            .catch(error => {
                console.log(error);
                setSessions([]);
            });
    }

    useEffect(() => {
        updateSessions();
        console.log(sessions);
    }, []);
    
    return (
        <Container maxWidth='md'>
            <Box sx={{mt: '10px'}}>
            {
                sessions.map((s, idx) => {
                    return (<SessionCard key={idx} id={s.id} user={s.user} actions={s.actions} />);
                })
            }
            </Box>
        </Container>
    );

}