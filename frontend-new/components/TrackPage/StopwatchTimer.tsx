'use client'
import { Typography } from "@mui/material";

export default function StopwatchTimer() {

    return (
        <div className="flex justify-center">
            <Typography variant="h1" className="my-10">
                {time.hours} : {time.minutes} : {time.seconds}
            </Typography>
        </div>
    )
}