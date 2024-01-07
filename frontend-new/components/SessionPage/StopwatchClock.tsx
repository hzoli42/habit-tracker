'use client'
import { StopwatchTime } from "@/app/page";
import { Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image"

export type StopwatchTimerProps = {
    time: StopwatchTime
}

export enum StopwatchMode {
    Stopwatch,
    Timer
}

export default function StopwatchClock({time} : StopwatchTimerProps) {
    const [mode, setMode] = useState<StopwatchMode>(StopwatchMode.Stopwatch)

    return (
        // <div className="flex items-center justify-center px-8 grid grid-cols-8 gap-0">
        //     <StopwatchDigit digit={time.hours / 10}/>
        //     <StopwatchDigit digit={time.hours % 10}/>
        //     <div className="flex justify-center"><p className="font-mono text-[100px]"> : </p></div>
        //     <StopwatchDigit digit={time.minutes / 10}/>
        //     <StopwatchDigit digit={time.minutes % 10}/>
        //     <div className="flex justify-center"><p className="font-mono text-[100px]"> : </p></div>
        //     <StopwatchDigit digit={time.seconds / 10}/>
        //     <StopwatchDigit digit={time.seconds % 10}/>
        // </div>
        <div className="flex justify-center px-8">
            <p className="font-monomaniac-one text-[100px] p-0 m-0">
                {time.hours > 9 ? "0" + time.hours : time.hours} : {time.minutes} : {time.seconds}
            </p>
        </div>
    )
}