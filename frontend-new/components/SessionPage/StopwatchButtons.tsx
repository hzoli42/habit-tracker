import { Dispatch, SetStateAction, useEffect } from "react";
import { Button } from '@mui/material';
import { Action, StopwatchTime } from "../../app/page";


export type StopwatchButtonProps = {
    start: () => void
    stop: () => void
    isRunning: boolean
}

export default function StopwatchButtons({start, stop, isRunning} : StopwatchButtonProps) {
    return (
        <div>
            {
                !isRunning
                ? <Button className="bg-green-400" variant="contained" onClick={start} fullWidth>Start</Button>
                : <Button className="bg-red-400" variant="contained" onClick={stop} fullWidth>Stop</Button>
            }
        </div>
    );
};