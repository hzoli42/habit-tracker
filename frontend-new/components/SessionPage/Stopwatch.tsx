import { Action, StopwatchTime } from "@/app/page";
import StopwatchButtons from "./StopwatchButtons";
import StopwatchTimer from "./StopwatchTimer";
import { useState } from "react";
import { Input } from "@/components/ui/input";



export default function Stopwatch() {
    const [time, setTime] = useState<StopwatchTime>({hours: 0, minutes: 0, seconds: 0})
    const [title, setTitle] = useState<string>("Untitled")
    const [isRunning, setIsRunning] = useState<boolean>(false)
    const [sessionId, setSessionId] = useState<string>("")

    return (
        <>
            <div className="grid grid-cols-4">
                <div className="col-span-3">
                    <StopwatchTimer time={time} />
                </div>
                <div className="grid content-center gap-4">
                    <Input placeholder="Title" onChange={e => setTitle(e.target.value)}/>
                    <StopwatchButtons 
                    time={time} setTime={setTime} title={title} isRunning={isRunning} setIsRunning={setIsRunning} 
                    sessionId={sessionId} setSessionId={setSessionId}/> 
                </div>   
            </div>
        </>  
    )
}