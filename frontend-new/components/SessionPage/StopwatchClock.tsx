import { StopwatchTime } from "@/app/page";
import { Typography } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";

export type StopwatchTimerProps = {
    time: StopwatchTime,
    setTime: Dispatch<SetStateAction<StopwatchTime>>;
    setStopwatchDirection: Dispatch<SetStateAction<number>>;
    isRunning: boolean
}

export enum StopwatchMode {
    Stopwatch,
    Timer
}

export default function StopwatchClock({time, setTime, setStopwatchDirection, isRunning} : StopwatchTimerProps) {
    function colouredDigits(digits: number) {
        const firstDigit = Math.floor(digits / 10)
        const secondDigit = digits  % 10

        return (
            <>
                {
                    firstDigit == 0 && !isRunning
                    ? <p className="text-[100px] text-slate-200 px-1">{firstDigit}</p>
                    : <p className="text-[100px] text-black-600 px-1">{firstDigit}</p>
                }
                {
                    secondDigit == 0 && !isRunning
                    ? <p className="text-[100px] text-slate-200 px-1">{secondDigit}</p>
                    : <p className="text-[100px] text-black-600 px-1">{secondDigit}</p>
                }
            </>
        )
    }

    function handleTabChange(value: string) {
        if (value == "timer") {
            setStopwatchDirection(-1)
        } else {
            setStopwatchDirection(1)
        }
    }
    
    // TODO: handle incorrect values, like >24 for hours >59 for minutes and seconds
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        switch(e.currentTarget.name) {
            case "hoursInput": {
                setTime({hours: parseInt(e.currentTarget.value), minutes: time.minutes, seconds: time.seconds});
                break;
            }
            case "minutesInput": {
                setTime({hours: time.hours, minutes: parseInt(e.currentTarget.value), seconds: time.seconds});
                break;
            }
            case "secondsInput": {
                setTime({hours: time.hours, minutes: time.minutes, seconds: parseInt(e.currentTarget.value)});
                break;
            }
        }
    }

    return (
        <Tabs defaultValue="stopwatch" onValueChange={handleTabChange}>
            <TabsList>
                <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
                <div className="flex justify-center items-end px-8">
                    {colouredDigits(time.hours)} <p className="text-[50px] pr-8 py-4">h</p>
                    {colouredDigits(time.minutes)} <p className="text-[50px] pr-8 py-4">m </p>
                    {colouredDigits(time.seconds)} <p className="text-[50px] pr-8 py-4">s </p>
                </div>
            </TabsContent>
            <TabsContent value="timer">
                {
                    !isRunning
                    ? <div className="flex justify-center items-end px-8 gap-1">
                        <input name="hoursInput" onChange={handleInputChange}
                            className="text-[100px] w-[128px] h-[110px] border-none placeholder-slate-200" 
                            type="text" maxLength={2} pattern="[0-9]*" placeholder="00"/>
                        <p className="text-[50px] pr-8 py-4">h</p>
                        <input name="minutesInput" onChange={handleInputChange}
                            className="text-[100px] w-[128px] h-[110px] border-none placeholder-slate-200" 
                            type="text" maxLength={2} pattern="[0-9]*" placeholder="00"/>
                        <p className="text-[50px] pr-8 py-4">m</p>
                        <input name="secondsInput" onChange={handleInputChange}
                            className="text-[100px] w-[128px] h-[110px] border-none placeholder-slate-200" 
                            type="text" maxLength={2} pattern="[0-9]*" placeholder="00"/>
                        <p className="text-[50px] pr-8 py-4">s</p>
                    </div>
                    : <div className="flex justify-center items-end px-8">
                        {colouredDigits(time.hours)} <p className="text-[50px] pr-8 py-4">h</p>
                        {colouredDigits(time.minutes)} <p className="text-[50px] pr-8 py-4">m </p>
                        {colouredDigits(time.seconds)} <p className="text-[50px] pr-8 py-4">s </p>
                    </div>
                }
            </TabsContent>
        </Tabs>
    )
}