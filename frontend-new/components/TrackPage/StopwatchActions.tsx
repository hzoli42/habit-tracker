'use client'
import { actionsAtom } from "@/app/atoms"
import { Grid, Paper, Typography } from "@mui/material";
import { useAtom } from "jotai"
import React from "react";

export default function StopWatchActions() {
    const [actions, setAction] = useAtom(actionsAtom);

    return (
        <>
            {
                actions.map((a, i) => { 
                    function paperColor(action: string) {
                        switch(action) {
                            case "start": return "bg-lime-200"
                            case "pause": return "bg-amber-200"
                            case "resume": return "bg-cyan-200"
                            case "stop": return "bg-red-200"
                        }
                        return ""
                    }
                    return (
                    <div className="grid grid-cols-1 grid-flow-row">
                        <Paper className={`flex flex-row grow ${paperColor(a.action)}`}>
                            <Typography className="grow ml-2">
                                {a.action}
                            </Typography>
                            <Typography className="mr-2">
                                {a.stopwatch_time.hours} : {a.stopwatch_time.minutes} : {a.stopwatch_time.seconds}
                            </Typography>
                        </Paper>
                    </div>
                    )
                })
            }
        </>
    )
}