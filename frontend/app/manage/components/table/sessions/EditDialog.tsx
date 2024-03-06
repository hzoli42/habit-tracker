import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/lib/api_utils/label"
import { Session, postSessionUpdate } from "@/lib/api_utils/session"
import { useState } from "react"
import EditIcon from '@mui/icons-material/Edit'
import { Label as UILabel } from "@/components/ui/label"
import { TitleTextField } from "@/components/utils/TitleTextField"
import LabelCombobox from "@/components/utils/LabelCombobox"
import { DateTimeField } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { useUser } from "@auth0/nextjs-auth0/client"



type Props = {
    session: Session
    labels: Label[]
    onNewLabel: (label: Label) => void
    onDialogSubmit: (sessionId: string, title: string, labelId: string | undefined) => void
}

function EditDialog({ session, labels, onNewLabel, onDialogSubmit }: Props) {
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState(session.title)
    const [label, setLabel] = useState<Label | undefined>()
    const [startTime, setStartTime] = useState(session.start_date.getTime())
    const [endTime, setEndTime] = useState(session.end_date.getTime())

    function handleNewLabel(label: Label) {
        onNewLabel(label)
    }

    function handleDialogSubmit() {
        setOpen(false)
        postSessionUpdate(session.session_id, user?.sub, title, label?.label_id).then(() => {
            onDialogSubmit(session.session_id, title, label?.label_id)
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex justify-start gap-2">
                    <EditIcon /> edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modify session details</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4 py-1">
                        <UILabel htmlFor="title" className="text-right">
                            Title:
                        </UILabel>
                        <div className="col-span-3">
                            <TitleTextField variant="standard" placeholder={session.title} onChange={(e) => setTitle(e.currentTarget.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4 py-1">
                        <UILabel htmlFor="labels" className="text-right">
                            Label:
                        </UILabel>
                        <div className="col-span-3">
                            <LabelCombobox value={label} labels={labels} disabled={false} onChange={(label) => setLabel(label)} onNewLabel={handleNewLabel} />
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
                    <Button onClick={handleDialogSubmit}>Edit session</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditDialog