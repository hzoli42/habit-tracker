import { Card, CardContent, Typography } from "@mui/material";
import { Session } from '../models/session';


export default function SessionCard(session: Session) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography>{session.id} </Typography>
                <Typography>{session.user} </Typography>
                <Typography>{session.actions[0].timestamp}</Typography>
            </CardContent>
        </Card>
    )
}