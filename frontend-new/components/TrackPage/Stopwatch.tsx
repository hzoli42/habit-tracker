'use client'
import { Action, StopwatchTime } from "@/app/page";
import StopwatchButtons from "./StopwatchButtons";
import StopwatchClock from "./StopwatchClock";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { LabelCombobox } from "./LabelCombobox";



export default function Stopwatch() {
    const [time, setTime] = useState<StopwatchTime>({hours: 0, minutes: 0, seconds: 0})
    const [title, setTitle] = useState<string>("Untitled")
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [sessionId, setSessionId] = useState<string>("")
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

        setTime({hours: hoursNew, minutes: minutesNew, seconds: secondsNew});
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

    function newAction(action: string): Action {
        const currentTime = Date.now() / 1000
        return {timestamp: currentTime, stopwatch_time: time, event: action}
    }

    async function start() {
        await fetch('http://0.0.0.0:80/session/start', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: "test",
                title: title,
                labels: [],
                action: newAction("start")
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.id)
            setSessionId(data.id)
        })
        setIsRunning(true)
    }
    
    async function stop() {
        await fetch('http://0.0.0.0:80/session/stop', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: sessionId,
                action: newAction("stop") 
            })
        });
        setIsRunning(false);
        setTime({hours: 0, minutes: 0, seconds: 0});
        setSessionId("")
    }

    return (
        <>
            <div className="grid grid-cols-4">
                <div className="col-span-3">
                    <StopwatchClock time={time} setTime={setTime} setStopwatchDirection={setStopwatchDirection} isRunning={isRunning}/>
                </div>
                <div className="grid grid-cols-1 content-center gap-4">
                    <Input placeholder="Title" onChange={e => setTitle(e.target.value)}/>
                    <LabelCombobox />
                    <StopwatchButtons start={start} stop={stop} isRunning={isRunning}/> 
                </div>   
            </div>
        </>  
    )
}