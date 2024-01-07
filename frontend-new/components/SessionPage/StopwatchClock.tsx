'use client'
import { StopwatchTime } from "@/app/page";
import { Typography } from "@mui/material";
import { useState } from "react";
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
        <Tabs defaultValue="stopwatch">
            <TabsList>
                <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
                <div className="flex justify-center items-end px-8">
                    <p className="font-mono text-[100px]">{time.hours}</p> <p className="font-mono text-[50px] pr-8 py-4">h</p>
                    <p className="font-mono text-[100px]">{time.minutes}</p> <p className="font-mono text-[50px] pr-8 py-4">m </p>
                    <p className="font-mono text-[100px]">{time.seconds}</p> <p className="font-mono text-[50px] pr-8 py-4">s </p>
                </div>
            </TabsContent>
            <TabsContent value="timer">
                <div className="flex justify-center items-end px-8">
                    <p className="font-mono text-[100px]">{time.hours}</p> <p className="font-mono text-[50px] pr-8 py-4">h</p>
                    <p className="font-mono text-[100px]">{time.minutes}</p> <p className="font-mono text-[50px] pr-8 py-4">m </p>
                    <p className="font-mono text-[100px]">{time.seconds}</p> <p className="font-mono text-[50px] pr-8 py-4">s </p>
                </div>
            </TabsContent>
        </Tabs>

        // <div className="flex justify-center px-8">
        //     <p className="font-monomaniac-one text-[100px] p-0 m-0">
        //         {time.hours > 9 ? "0" + time.hours : time.hours} : {time.minutes} : {time.seconds}
        //     </p>
        // </div>
    )
}