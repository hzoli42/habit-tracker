'use client'
import { DateTimeField } from "@mui/x-date-pickers";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LabelCombobox } from "../utils/LabelCombobox";
import dayjs from "dayjs";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { userAllSessionsAtom, Label as LabelAtom } from "@/atoms/jotai";
import { useAtom } from "jotai";
import { postSessionStart, postSessionStop } from "@/lib/api_utils";
import { TitleTextField } from "../utils/TitleTextField";

export default function NewSessionDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("")
    const [label, setLabel] = useState<LabelAtom | undefined>(undefined)
    const [startTime, setStartTime] = useState(dayjs().unix())
    const [endTime, setEndTime] = useState(dayjs().unix())
    const { user, error, isLoading } = useUser();
    const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)


    async function onDialogSubmit() {
        let sessionId = ""
        await postSessionStart(user?.sub, title, label?.id ?? undefined, startTime)
            .then(response => response.json())
            .then(data => {
                sessionId = data.id
            })
        await postSessionStop(sessionId, endTime)
        setOpen(false)
        setUserAllSessions(user?.sub)
    }

    function handleLabelChange(selectedLabel: LabelAtom) {
        setLabel(selectedLabel)
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
                    <div className="grid grid-cols-4 items-center gap-4 py-1">
                        <Label htmlFor="title" className="text-right">
                            Title:
                        </Label>
                        <div className="col-span-3">
                            <TitleTextField variant="standard" placeholder="Title" onChange={(e) => setTitle(e.currentTarget.value)} />
                            {/* <Input
                            id="title"
                            defaultValue="Untitled"
                            className="col-span-3"
                            onChange={(e) => setTitle(e.currentTarget.value)}
                        /> */}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 py-1">
                        <Label htmlFor="labels" className="text-right">
                            Label:
                        </Label>
                        <div className="col-span-3">
                            <LabelCombobox selectedLabel={label} disabled={false} onLabelChange={handleLabelChange} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start" className="text-right">
                            Start time:
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
                            Stop time:
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

