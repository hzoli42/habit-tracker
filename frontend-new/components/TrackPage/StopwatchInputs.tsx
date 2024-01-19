import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from '@mui/material';
import { Action, StopwatchTime } from "../../app/page";
import { LabelCombobox } from "../utils/LabelCombobox";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Input } from "../ui/input";


export type StopwatchButtonProps = {
    isRunning: boolean
    setIsRunning: Dispatch<SetStateAction<boolean>>
    time: StopwatchTime,
    setTime: Dispatch<SetStateAction<StopwatchTime>>;
}

export default function StopwatchInputs({ isRunning, setIsRunning, time, setTime }: StopwatchButtonProps) {
    const { user, error, isLoading } = useUser();
    const [title, setTitle] = useState<string>("Untitled")
    const [labels, setLabels] = useState<string[]>([])
    const [labelValues, setLabelValues] = useState<string[]>([])
    const [sessionId, setSessionId] = useState<string>("")


    function newAction(action: string): Action {
        const currentTime = Date.now() / 1000
        return { timestamp: currentTime, stopwatch_time: time, event: action }
    }

    async function start() {
        await fetch('http://0.0.0.0:5000/session/start', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user ? user.sub : "undefined",
                title: title,
                labels: labelValues,
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
        await fetch('http://0.0.0.0:5000/session/stop', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: sessionId,
                action: newAction("stop")
            })
        });
        setIsRunning(false);
        setTime({ hours: 0, minutes: 0, seconds: 0 });
        setSessionId("")
    }

    useEffect(() => {
        if (isLoading) {
            return
        }
        console.log(user)
        fetch(`http://0.0.0.0:5000/user/${user?.sub}/labels`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(data => {
                console.log(`Id = ${data.id}, Labels = ${data.labels}`)
                setLabels(data.labels)
            })
    }, [isLoading])


    return (
        <div className="grid grid-cols-1 content-center gap-4">
            <Input placeholder="Title" onChange={e => setTitle(e.target.value)} />
            <LabelCombobox />
            {
                !isRunning
                    ? <Button className="bg-green-400" variant="contained" onClick={start} fullWidth>Start</Button>
                    : <Button className="bg-red-400" variant="contained" onClick={stop} fullWidth>Stop</Button>
            }
        </div>
    );
};