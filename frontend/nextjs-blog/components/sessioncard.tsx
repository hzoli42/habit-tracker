import { Card, CardContent, Container, Typography } from "@mui/material";
import { Session } from '../models/session';


export default function SessionCard(session: Session) {
    return (
        <Card variant="outlined" sx={{ display: 'flex' }}>
            <CardContent>
                <Typography>User: {session.user} </Typography>
                <Typography>Title: TODO->Session Titles</Typography>
                <Typography>ID: {session.id} </Typography>
                <Typography>Tags: </Typography>
            </CardContent>
            <CardContent>
                <Typography>Actions</Typography>
                {
                    session.actions.map((a, idx) => {
                        const date = new Date(a.timestamp * 1000);
                        return (<Typography>{date.toLocaleString()}: {a.action}</Typography>);
                    })
                }
            </CardContent>
        </Card>
    )
}