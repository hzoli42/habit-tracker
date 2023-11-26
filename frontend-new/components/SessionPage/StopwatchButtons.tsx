import { Dispatch, SetStateAction, useEffect } from "react";
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React from "react";
import { Action, StopwatchTime } from "../../app/page"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button as ShadButton} from "../ui/button"

export type StopwatchButtonProps = {
    time: StopwatchTime;
    setTime: Dispatch<SetStateAction<StopwatchTime>>;
    title: string;
    isRunning: boolean;
    setIsRunning: Dispatch<SetStateAction<boolean>>;
    sessionId: string;
    setSessionId: Dispatch<SetStateAction<string>>;
}

export default function StopwatchButtons(
    {time, setTime, title, isRunning, setIsRunning, sessionId, setSessionId} : StopwatchButtonProps
    ) {
   
    function incrementSecond() {
        const [secondsDiv, secondsMod] = [Math.floor((time.seconds + 1) / 60), (time.seconds + 1) % 60];
        const [minutesDiv, minutesMod] = [Math.floor((time.minutes + secondsDiv) / 60), (time.minutes + secondsDiv) % 60];
        const hoursMod = (time.hours + minutesDiv) % 24;
        setTime({hours: hoursMod, minutes: minutesMod, seconds: secondsMod});
    }

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

    // function toggle() {
    //     if (isActive) {
    //         setActions(actions.concat(newAction('pause')))
    //     } else {
    //         setActions(actions.concat(newAction('resume')))
    //     }
    //     setIsActive(!isActive);
    // }
    
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

    useEffect(() => {
        let interval: NodeJS.Timer | undefined = undefined;
        if (isRunning) {
            interval = setInterval(() => {
                incrementSecond();
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, time]);

    return (
        <>
            <div className="grid grid-flow-col grid-cols-2 gap-4">
                <div>
                    {
                        !isRunning
                        ? <Button className="bg-green-400" variant="contained" onClick={start} fullWidth>Start</Button>
                        : <Button className="bg-red-400" variant="contained" onClick={stop} fullWidth>Stop</Button>
                    }
                </div>
            </div>
        </>
    );
};