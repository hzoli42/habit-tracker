'use client'
import { DateTimeField } from "@mui/x-date-pickers";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LabelCombobox } from "../utils/LabelCombobox";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { LabelData, userAllSessionsAtom } from "@/atoms/jotai";
import { useAtom } from "jotai";

export default function NewSessionDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("")
    const [label, setLabel] = useState<string | undefined>(undefined)
    const [startTime, setStartTime] = useState(dayjs().unix())
    const [endTime, setEndTime] = useState(dayjs().unix())
    const { user, error, isLoading } = useUser();
    const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)


    async function onDialogSubmit() {
        let sessionId = ""
        await fetch('http://0.0.0.0:5000/session/start', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user ? user.sub : "undefined",
                title: title,
                label_id: label,
                action: {
                    timestamp: startTime,
                    event: "start"
                }
            })
        })
            .then(response => response.json())
            .then(data => {
                sessionId = data.id
            })
        await fetch('http://0.0.0.0:5000/session/stop', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: sessionId,
                action: {
                    timestamp: endTime,
                    event: "stop"
                }
            })
        })
        setOpen(false)
        setUserAllSessions(user?.sub)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                    + New
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter session details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            defaultValue="Untitled"
                            className="col-span-3"
                            onChange={(e) => setTitle(e.currentTarget.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="labels" className="text-right">
                            Labels
                        </Label>
                        <div className="col-span-3">
                            <LabelCombobox disabled={false} onLabelChange={(selectedLabel) => setLabel(selectedLabel)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start" className="text-right">
                            Start time
                        </Label>
                        <div className="col-span-3">
                            <DateTimeField
                                id="start"
                                value={dayjs.unix(startTime)}
                                onChange={(value) => setStartTime(value ? value.unix() : 0)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="stop" className="text-right">
                            Stop time
                        </Label>
                        <div className="col-span-3">
                            <DateTimeField
                                id="stop"
                                value={dayjs.unix(endTime)}
                                onChange={(value) => setEndTime(value ? value.unix() : 0)}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onDialogSubmit}>Create session</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

