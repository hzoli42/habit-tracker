import { Action, StopwatchTime } from "@/app/page";
import StopwatchActions from "./StopwatchActions";
import StopwatchButtons from "./StopwatchButtons";
import StopwatchTimer from "./StopwatchTimer";
import { useState } from "react";

export default function Stopwatch() {
    const [time, setTime] = useState<StopwatchTime>({hours: 0, minutes: 0, seconds: 0})
    const [title, setTitle] = useState<string>("Untitled")
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [sessionId, setSessionId] = useState<string>("")

    return (
        <>
            <div>
                <StopwatchTimer time={time} />
                <StopwatchButtons 
                time={time} setTime={setTime} title={title} isRunning={isRunning} setIsRunning={setIsRunning} 
                sessionId={sessionId} setSessionId={setSessionId}/>    
            </div>
            {/* <div>
                <StopwatchActions/>
            </div> */}
        </>  
    )
}