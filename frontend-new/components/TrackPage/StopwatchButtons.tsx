'use client'
import { useEffect } from "react";
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";
import { Action, StopwatchTime } from "../../app/page"
import { actionsAtom, isActiveAtom, sessionIdAtom, timeAtom, titleInputAtom } from "@/app/atoms";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button as ShadButton} from "../ui/button"

export default function Stopwatch() {
    const [time, setTime] = useAtom(timeAtom);
    const [titleInput, setTitleInput] = useAtom(titleInputAtom);
    const [isActive, setIsActive] = useAtom(isActiveAtom);
    const [sessionId, setSessionId] = useAtom(sessionIdAtom);
    const [actions, setActions] = useAtom(actionsAtom);


    function incrementSecond() {
        const [secondsDiv, secondsMod] = [Math.floor((time.seconds + 1) / 60), (time.seconds + 1) % 60];
        const [minutesDiv, minutesMod] = [Math.floor((time.minutes + secondsDiv) / 60), (time.minutes + secondsDiv) % 60];
        const hoursMod = (time.hours + minutesDiv) % 24;
        setTime({hours: hoursMod, minutes: minutesMod, seconds: secondsMod});
    }

    function newAction(action: string): Action {
        const currentTime = Date.now() / 1000
        return {timestamp: currentTime, stopwatch_time: time, action: action}
    }

    async function start() {
        const userId = user ? user.sub : "Unknown"
        const title = titleInput !== "" ? titleInput : "Unknown"
        await fetch('http://0.0.0.0:80/sessions/start', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                title: title,
                labels: []
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.id)
            setSessionId(data.id)
        })
        setIsActive(true)
        setActions(actions.concat(newAction('start')))
    }

    function toggle() {
        if (isActive) {
            setActions(actions.concat(newAction('pause')))
        } else {
            setActions(actions.concat(newAction('resume')))
        }
        setIsActive(!isActive);
    }
    
    async function stop() {
        const postActions = actions.concat(newAction('stop'))
        postActions.forEach(a => console.log(a.action))
        await fetch('http://0.0.0.0:80/sessions/stop', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: sessionId,
                actions: postActions
            })
        });
        setIsActive(false);
        setTime({hours: 0, minutes: 0, seconds: 0});
        setSessionId("")
        setActions([])
    }

    useEffect(() => {
        let interval: NodeJS.Timer | undefined = undefined;
        if (isActive) {
            interval = setInterval(() => {
                incrementSecond();
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    function displayStopwatchIsReset() {
        return (
            <div className="grid grid-flow-col grid-cols-2 gap-4">
                <div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <ShadButton>Select session label <ArrowDropDownIcon /></ShadButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
                <div>
                    <Button className="bg-green-400" variant="contained" onClick={start} fullWidth>
                        Start
                    </Button>
                </div>
            </div>
        )
    }

    function displayStopwatchIsRunning() {
        return (
            <div className="grid grid-flow-col grid-cols-2 gap-4">
                <div>
                    <Button variant="outlined" onClick={toggle} fullWidth>
                        {isActive ? "Pause" : "Resume"}
                    </Button>
                </div>
                <div>
                    <Button className="bg-red-500" variant="contained" onClick={stop} fullWidth>
                        Stop
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <>
            {   
                !isActive && time.hours === 0 && time.minutes === 0 && time.seconds === 0 && sessionId === ""
                ? displayStopwatchIsReset()
                : displayStopwatchIsRunning()
            }
        </>
    );
};