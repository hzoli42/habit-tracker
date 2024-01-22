import { DateTimeField } from "@mui/x-date-pickers";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LabelCombobox } from "../utils/LabelCombobox";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function NewSessionDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("")
    const [labels, setLabels] = useState<string[]>([])
    const [startTime, setStartTime] = useState(0)
    const [endTime, setEndTime] = useState(0)
    const { user, error, isLoading } = useUser();


    async function onDialogSubmit() {
        let sessionId = ""
        await fetch('http://0.0.0.0:5000/session/start', {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user ? user.sub : "undefined",
                title: title,
                labels: labels,
                action: {
                    timestamp: startTime,
                    stopwatch_time: { hours: 0, minutes: 0, seconds: 0 },
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
                    stopwatch_time: { hours: 0, minutes: 0, seconds: 0 },
                    event: "stop"
                }
            })
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger><p className="text-[50px] text-gray-500">+</p></DialogTrigger>
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
                            <LabelCombobox onLabelsChange={(selectedLabels) => setLabels(selectedLabels)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="start" className="text-right">
                            Start time
                        </Label>
                        <div className="col-span-3">
                            <DateTimeField
                                id="start"
                                defaultValue={dayjs()}
                                onChange={(dayjs) => setStartTime(dayjs ? dayjs.unix() : 0)}
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
                                defaultValue={dayjs()}
                                onChange={(dayjs) => setEndTime(dayjs ? dayjs.unix() : 0)}
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

