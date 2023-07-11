'use client'
import { timeAtom } from "@/app/atoms";
import { Typography } from "@mui/material";
import { useAtom } from "jotai";

export default function StopwatchTimer() {
    const [time, setTime] = useAtom(timeAtom);

    return (
        <div className="flex justify-center">
            <Typography variant="h1" className="my-10">
                {time.hours} : {time.minutes} : {time.seconds}
            </Typography>
        </div>
    )
}