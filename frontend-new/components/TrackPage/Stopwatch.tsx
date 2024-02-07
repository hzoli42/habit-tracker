'use client'
import StopwatchClock from "./StopwatchClock";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import StopwatchInputs from "./StopwatchInputs";
import { labelsAtom } from "@/atoms/jotai";
import { useAtom } from "jotai";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import useSound from "use-sound";
import alarmSound from '../../sounds/alarm_sound.mp3';


export type StopwatchTime = {
    hours: number,
    minutes: number,
    seconds: number
}

export type Action = {
    timestamp: number;
    event: string;
}

export function newAction(action: string): Action {
    const currentTime = Date.now() / 1000
    return { timestamp: currentTime, event: action }
}

export function startSession(user: string, title: string, label: string | undefined): Promise<string> {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/start`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: user,
            title: title,
            label_id: label ?? "",
            action: newAction("start")
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.id)
            return data.id
        })
}

export async function stopSession(sessionId: string) {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/stop`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: sessionId,
            action: newAction("stop")
        })
    });
}


export default function Stopwatch() {
    const [labels, setLabels] = useAtom(labelsAtom)
    const [time, setTime] = useState<StopwatchTime>({ hours: 0, minutes: 0, seconds: 0 })
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [stopwatchDirection, setStopwatchDirection] = useState<number>(1)
    const [title, setTitle] = useState<string>("Untitled")
    const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined)
    const { user, error, isLoading } = useUser();
    const [sessionId, setSessionId] = useState<string>("")
    const [timerExpiredDialogOpen, setTimerExpiredDialogOpen] = useState(false)
    const [playAlarm, { stop }] = useSound(alarmSound, { volume: 0.5 })

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
        if (hoursNew == 0 && minutesNew == 0 && secondsNew == 0 && stopwatchDirection == -1) {
            console.log('Stopping session because timer reached 0')
            setTimerExpiredDialogOpen(true)
            playAlarm()
            setIsRunning(false)
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

    useEffect(() => {
        if (isLoading) {
            return
        }
        if (isRunning) {
            startSession(user?.sub ?? "", title, selectedLabel).then(sessionId => setSessionId(sessionId))
        } else {
            console.log('Stopping session because isRunning changed back to false')
            stopSession(sessionId)
            setTitle("Untitled")
            setSelectedLabel(undefined)
            setTime({ hours: 0, minutes: 0, seconds: 0 })
        }
    }, [isRunning])

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="md:col-span-3">
                    <StopwatchClock time={time} setTime={setTime} setStopwatchDirection={setStopwatchDirection} isRunning={isRunning} />
                </div>
                <StopwatchInputs
                    isRunning={isRunning}
                    setIsRunning={setIsRunning}
                    onTitleChange={(title) => setTitle(title)}
                    onLabelChange={(label) => setSelectedLabel(label)}
                />
            </div>
            <Dialog open={timerExpiredDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Your timer has expired!</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => {
                            setTimerExpiredDialogOpen(false)
                            stop()
                        }}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}