'use client'
import { StopwatchTime } from "@/app/page";
import { Typography } from "@mui/material";
import { useState } from "react";

export type StopwatchTimerProps = {
    time: StopwatchTime
}

export default function StopwatchTimer({time} : StopwatchTimerProps) {
    return (
        <div className="flex justify-center">
            <Typography variant="h1" className="my-10">
                {time.hours} : {time.minutes} : {time.seconds}
            </Typography>
        </div>
    )
}