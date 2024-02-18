import { Card, CardContent, Typography } from "@mui/material";
import { Session } from '../../models/session';


export default function SessionCard(session: Session) {
    return (
        <Card variant="outlined" sx={{ display: 'flex' }}>
            <CardContent>
                <Typography>User: {session.user_id} </Typography>
                <Typography>Title: {session.title}</Typography>
                <Typography>ID: {session.id} </Typography>
                <Typography>Tags: </Typography>
            </CardContent>
            <CardContent>
                <Typography>Actions</Typography>
                {
                    session.actions.map((a, idx) => {
                        const date = new Date(a.timestamp);
                        return (<Typography>{date.toLocaleString()}: {a.action}</Typography>);
                    })
                }
            </CardContent>
        </Card>
    )
}