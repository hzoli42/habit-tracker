'use client'
import { Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Action } from "@/app/page";

export type StopwatchActionsProps = {
    actions: Action[]
}

export default function StopWatchActions({actions} : StopwatchActionsProps) {

    return (
        <>  
            <ScrollArea className="rounded-md h-56 mt-4">
                <div className="grid grid-row gap-1">
                {
                    actions.map((a, i) => {
                        function borderColor(action: string) {
                            switch(action) {
                                case "start": return "border-lime-300"
                                case "stop": return "border-red-300"
                            }
                            return ""
                        }
                        function backgroundColor(action: string) {
                            switch(action) {
                                case "start": return "bg-lime-100"
                                case "stop": return "bg-red-100"
                            }
                            return ""
                        }
                        return (
                        
                                <Paper variant="outlined" className={`flex flex-row grow${borderColor(a.action)} ${backgroundColor(a.action)}`}>
                                    <Typography className="grow ml-2">
                                        {a.action}
                                    </Typography>
                                    <Typography className="mr-2">
                                        {a.stopwatch_time.hours} : {a.stopwatch_time.minutes} : {a.stopwatch_time.seconds}
                                    </Typography>
                                </Paper>
                        )
                    })
                }
                </div>
            </ScrollArea>
        </>
    )
}