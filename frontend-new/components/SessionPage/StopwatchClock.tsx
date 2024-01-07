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
    function colouredDigits(digits: number) {
        const firstDigit = digits / 10
        const secondDigit = digits  % 10

        return (
            <>
                {
                    firstDigit == 0
                    ? <p className="font-mono text-[100px] text-slate-200 px-1">{firstDigit}</p>
                    : <p className="font-mono text-[100px] text-black-600 px-1">{firstDigit}</p>
                }
                {
                    secondDigit == 0
                    ? <p className="font-mono text-[100px] text-slate-200 px-1">{secondDigit}</p>
                    : <p className="font-mono text-[100px] text-black-600 px-1">{secondDigit}</p>
                }
            </>
        )


    }

    return (
        <Tabs defaultValue="stopwatch">
            <TabsList>
                <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
            </TabsList>
            <TabsContent value="stopwatch">
                <div className="flex justify-center items-end px-8">
                    {colouredDigits(time.hours)} <p className="font-mono text-[50px] pr-8 py-4">h</p>
                    {colouredDigits(time.minutes)} <p className="font-mono text-[50px] pr-8 py-4">m </p>
                    {colouredDigits(time.seconds)} <p className="font-mono text-[50px] pr-8 py-4">s </p>
                </div>
            </TabsContent>
            <TabsContent value="timer">
                <div className="flex justify-center items-end px-8">
                    {colouredDigits(time.hours)} <p className="font-mono text-[50px] pr-8 py-4">h</p>
                    {colouredDigits(time.minutes)} <p className="font-mono text-[50px] pr-8 py-4">m </p>
                    {colouredDigits(time.seconds)} <p className="font-mono text-[50px] pr-8 py-4">s </p>
                </div>
            </TabsContent>
        </Tabs>
    )
}