'use client'
import { Action, StopwatchTime } from "@/app/page";
import StopwatchButtons from "./StopwatchInputs";
import StopwatchClock from "./StopwatchClock";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { LabelCombobox } from "./LabelCombobox";
import { useUser } from "@auth0/nextjs-auth0/client";
import StopwatchInputs from "./StopwatchInputs";



export default function Stopwatch() {
    const [time, setTime] = useState<StopwatchTime>({ hours: 0, minutes: 0, seconds: 0 })
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [stopwatchDirection, setStopwatchDirection] = useState<number>(1)


    function timeStep() {
        const secondsInc = time.seconds + stopwatchDirection
        const secondsCarry = secondsInc > 59 ? 1 : (secondsInc < 0 ? -1 : 0)
        const secondsNew = secondsInc > 59 ? secondsInc % 60 : (secondsInc < 0 ? (secondsInc + 60) % 60 : secondsInc)

        const minutesInc = time.minutes + secondsCarry
        const minutesCarry = minutesInc > 59 ? 1 : (minutesInc < 0 ? -1 : 0)
        const minutesNew = minutesInc > 59 ? minutesInc % 60 : (minutesInc < 0 ? (minutesInc + 60) % 60 : minutesInc)

        const hoursInc = time.hours + minutesCarry
        const hoursNew = hoursInc > 59 ? hoursInc % 60 : (hoursInc < 0 ? (hoursInc + 60) % 60 : hoursInc)

        setTime({ hours: hoursNew, minutes: minutesNew, seconds: secondsNew });
        if (hoursNew == 0 && minutesNew == 0 && secondsNew == 0) {
            stop()
        }
    }

    useEffect(() => {
        let interval: NodeJS.Timer | undefined = undefined;
        if (isRunning) {
            interval = setInterval(() => {
                timeStep();
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    return (
        <>
            <div className="grid grid-cols-4">
                <div className="col-span-3">
                    <StopwatchClock time={time} setTime={setTime} setStopwatchDirection={setStopwatchDirection} isRunning={isRunning} />
                </div>
                <StopwatchInputs isRunning={isRunning} setIsRunning={setIsRunning} time={time} setTime={setTime} />
            </div>
        </>
    )
}