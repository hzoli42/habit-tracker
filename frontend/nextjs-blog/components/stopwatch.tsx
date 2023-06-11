import { useState, useEffect } from "react";
import styles from "../styles/Stopwatch.module.css";
import { Box, Button, Grid, Typography } from '@mui/material';
import Image from "next/image";
import axios from "axios";

type Time = {
    hours: number;
    minutes: number;
    seconds: number;
}

export default function Stopwatch() {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState<Time>({hours: 0, minutes: 0, seconds: 0});
    const [sessionId, setSessionId] = useState("");

    const StopwatchImage = () => (
        <Image
            src="/images/stopwatch.jpg"
            height={150}
            width={130}
            alt="Stopwatch"
        />
    );
    
    function incrementSecond() {
        const [secondsDiv, secondsMod] = [Math.floor((time.seconds + 1) / 60), (time.seconds + 1) % 60];
        const [minutesDiv, minutesMod] = [Math.floor((time.minutes + secondsDiv) / 60), (time.minutes + secondsDiv) % 60];
        const hoursMod = (time.hours + minutesDiv) % 24;
        setTime({hours: hoursMod, minutes: minutesMod, seconds: secondsMod});
    }

    async function start() {
        
    }

    async function toggle() {
        if (sessionId === "") {
            await axios.post('http://0.0.0.0:80/sessions/start', {user: "zolika"})
            .then(response => {
                console.log(response.data.id)
                setSessionId(response.data.id)
            })
            setIsActive(true)
            return
        }
        if (isActive) {
            await axios.post('http://0.0.0.0:80/sessions/pause', {id: sessionId})
        } else {
            await axios.post('http://0.0.0.0:80/sessions/resume', {id: sessionId})
        }
        setIsActive(!isActive);
    }
    
    async function reset() {
        await axios.post('http://0.0.0.0:80/sessions/stop', {id: sessionId})
        setIsActive(false);
        setTime({hours: 0, minutes: 0, seconds: 0});
        setSessionId("")
    }

    function startButtonText() {
        if(sessionId === "") {
            return "Start";
        }
        if(isActive) {
            return "Pause";
        }
        return "Resume";
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

    return (
        <Grid container spacing={2}>
            <Grid item container xs={12} className={styles.stopwatch}>
                    <StopwatchImage />
            </Grid>
            <Grid item container xs={12} className={styles.stopwatch}>
                <Typography variant="h2">
                    {time.hours} : {time.minutes} : {time.seconds}
                </Typography>
            </Grid>
            <Grid item container xs={6} className={styles.stopwatch}>
                <Button variant={isActive ? "outlined" : "contained"} color={isActive ? "error" : "success"} onClick={toggle} fullWidth>
                    {startButtonText()}
                </Button>
            </Grid>
            <Grid item container xs={6} className={styles.stopwatch}>
                <Button variant="outlined" onClick={reset} fullWidth>
                    Reset
                </Button>
            </Grid>
        </Grid>
    );
};