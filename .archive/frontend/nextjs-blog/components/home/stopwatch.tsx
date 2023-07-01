import { useState, useEffect } from "react";
import { Button, Grid, Paper, TextField, Typography } from '@mui/material';
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

type Time = {
    hours: number;
    minutes: number;
    seconds: number;
}

type Action = {
    time: Time;
    action: string;
}



export default function Stopwatch() {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState<Time>({hours: 0, minutes: 0, seconds: 0});
    const [sessionId, setSessionId] = useState("");
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [titleInput, setTitleInput] = useState("");
    const [actions, setActions] = useState<Action[]>([]);
    
    function incrementSecond() {
        const [secondsDiv, secondsMod] = [Math.floor((time.seconds + 1) / 60), (time.seconds + 1) % 60];
        const [minutesDiv, minutesMod] = [Math.floor((time.minutes + secondsDiv) / 60), (time.minutes + secondsDiv) % 60];
        const hoursMod = (time.hours + minutesDiv) % 24;
        setTime({hours: hoursMod, minutes: minutesMod, seconds: secondsMod});
    }

    async function start() {
        await axios.post('http://0.0.0.0:80/sessions/start', {user_id: user.sub, title: titleInput})
            .then(response => {
                console.log(response.data.id)
                setSessionId(response.data.id)
            })
            setIsActive(true)
            setActions(actions.concat({time: time, action: 'start'}))
    }

    async function toggle() {
        if (isActive) {
            await axios.post('http://0.0.0.0:80/sessions/pause', {id: sessionId})
            setActions(actions.concat({time: time, action: 'pause'}))
        } else {
            await axios.post('http://0.0.0.0:80/sessions/resume', {id: sessionId})
            setActions(actions.concat({time: time, action: 'resume'}))
        }
        setIsActive(!isActive);
    }
    
    async function stop() {
        await axios.post('http://0.0.0.0:80/sessions/stop', {id: sessionId})
        setIsActive(false);
        setTime({hours: 0, minutes: 0, seconds: 0});
        setSessionId("")
        setActions([])
    }

    useEffect(() => {
        let interval = null;
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
        console.log(`Stopwatch is Reset --> isActive: ${isActive}, time: ${time.hours === 0 && time.minutes === 0 && time.seconds === 0}, session: ${sessionId}}`)
        return (<React.Fragment>
                    <Grid item container xs={6}>
                        <TextField label="Title" variant="outlined" required onChange={(event => setTitleInput(event.target.value))}/>
                    </Grid>
                    <Grid item container xs={6}>
                        <Button className="bg-green-500" variant="contained" onClick={start} fullWidth>
                            Start
                        </Button>
                    </Grid>
                </React.Fragment>)
    }

    function displayStopwatchIsRunning() {
        console.log(`Stopwatch is Running --> isActive: ${isActive}, time: ${time.hours === 0 && time.minutes === 0 && time.seconds === 0}, session: ${sessionId}`)
        return (<React.Fragment>
                    <Grid item container xs={6}>
                        <Button variant="outlined" onClick={toggle} fullWidth>
                            {isActive ? "Pause" : "Resume"}
                        </Button>
                    </Grid>
                    <Grid item container xs={6}>
                        <Button className="bg-red-500" variant="contained" onClick={stop} fullWidth>
                            Stop
                        </Button>
                    </Grid>
                        {
                            actions.map(a => 
                                {
                                    const actionToBgColor = {
                                        "start": "bg-lime-200",
                                        "pause": "bg-amber-200",
                                        "resume": "bg-cyan-200"       
                                    }
                                    return (
                                    <Grid item container xs={12} columnSpacing={0} rowSpacing={1}>
                                        <Paper className={`flex flex-row grow ${actionToBgColor[a.action]}`}>
                                            <Typography className="grow ml-2">{a.action}</Typography>
                                            <Typography className="mr-2">{a.time.hours} : {a.time.minutes} : {a.time.seconds}</Typography>
                                        </Paper>
                                    </Grid>
                                    )
                                }
                            )
                        }
                </React.Fragment>)
    }

    return (
        <Grid container spacing={2}>
            <Grid item container xs={12} className="flex flex-row justify-center">
                <Typography variant="h1" className="my-10">
                    {time.hours} : {time.minutes} : {time.seconds}
                </Typography>
            </Grid>
            {   !isActive && time.hours === 0 && time.minutes === 0 && time.seconds === 0 && sessionId === ""
                ? displayStopwatchIsReset()
                : displayStopwatchIsRunning()
            }
            
        </Grid>
    );
};