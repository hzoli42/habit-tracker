'use client'
import { DateTimeField } from "@mui/x-date-pickers";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TitleTextField } from "../../../components/utils/TitleTextField";
import 'dayjs/plugin/utc';
import LabelCombobox from "@/components/utils/LabelCombobox";
import { postSessionEventStop, postSessionNew } from "@/lib/api_utils/session";
import { Label, getAllUserLabels } from "@/lib/api_utils/label";
import { Label as UILabel } from "@/components/ui/label";

type Props = {
    onDialogSubmit: () => void
}

function NewSessionDialog({ onDialogSubmit }: Props) {
    dayjs.extend(require('dayjs/plugin/utc'));

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("")
    const [label, setLabel] = useState<Label | undefined>(undefined)
    const [labels, setLabels] = useState<Label[]>([])
    const [startTime, setStartTime] = useState(dayjs().unix())
    const [endTime, setEndTime] = useState(dayjs().unix())
    const { user, error, isLoading } = useUser();

    useEffect(() => {
        if (isLoading) {
            return
        }
        getAllUserLabels(user?.sub)
            .then(r => r.json())
            .then((d: Label[]) => setLabels(d))
    }, [isLoading])

    async function handleDialogSubmit() {
        let sessionId = ""
        const startTimeUTC = dayjs.unix(startTime).utc().unix() * 1000
        const endTimeUTC = dayjs.unix(endTime).utc().unix() * 1000
        await postSessionNew(user?.sub, title, label?.label_id ?? undefined, startTimeUTC)
            .then(response => response.json())
            .then(data => {
                sessionId = data.session_id
            })
        await postSessionEventStop(sessionId, user?.sub, endTimeUTC).then(() => {
            setOpen(false)
            onDialogSubmit()
        })
    }

    function handleChangeLabel(selectedLabel: Label | undefined) {
        setLabel(selectedLabel)
    }

    function handleNewLabel(label: Label) {
        setLabel(label)
        getAllUserLabels(user?.sub)
            .then(r => r.json())
            .then((d: Label[]) => setLabels(d))
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
                        <UILabel htmlFor="title" className="text-right">
                            Title:
                        </UILabel>
                        <div className="col-span-3">
                            <TitleTextField variant="standard" placeholder="Title" onChange={(e) => setTitle(e.currentTarget.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 py-1">
                        <UILabel htmlFor="labels" className="text-right">
                            Label:
                        </UILabel>
                        <div className="col-span-3">
                            <LabelCombobox value={label} labels={labels} disabled={false} onChange={handleChangeLabel} onNewLabel={handleNewLabel} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <UILabel htmlFor="start" className="text-right">
                            Start time:
                        </UILabel>
                        <div className="col-span-3">
                            <DateTimeField
                                id="start"
                                value={dayjs.unix(startTime)}
                                onChange={(value) => setStartTime(value ? value.unix() : 0)}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <UILabel htmlFor="stop" className="text-right">
                            Stop time:
                        </UILabel>
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
                    <Button onClick={handleDialogSubmit}>Create session</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default NewSessionDialog

