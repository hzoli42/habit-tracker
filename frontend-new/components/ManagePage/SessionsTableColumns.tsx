

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { Label, Session, editedSessionsAtom, labelsAtom, userAllSessionsAtom } from "@/atoms/jotai"
import DeleteIcon from '@mui/icons-material/Delete'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useEffect, useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { deleteSessionById } from "@/lib/api_utils"
import { TitleTextField } from "../utils/TitleTextField"
import { Checkbox } from "../ui/checkbox"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


export const sessionColumns: ColumnDef<Session>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && undefined)
                }

                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "session",
        header: "",
        cell: ({ row }) => {
            const [sessions, setSessions] = useAtom(editedSessionsAtom)
            const [labels, setLabels] = useAtom(labelsAtom)
            const [currentLabel, setCurrentLabel] = useState<Label | undefined>(undefined)

            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

            useEffect(() => {
                setCurrentLabel(labels.find(ld => ld.id === row.original.label_id))
            }, [labels])

            useEffect(() => {
                const referenceLabel = sessions.get(row.original.id)?.labelId ?? row.original.label_id
                setCurrentLabel(labels.find(ld => ld.id === referenceLabel))
            }, [sessions])

            const updateSessionTitle = (newTitle: string) => {
                if (newTitle == "") {
                    return
                }
                const label_id = sessions.get(row.original.id)?.labelId ?? row.original.label_id
                const newSessions = new Map(sessions).set(row.original.id, { title: newTitle, labelId: label_id })
                setSessions(newSessions)
            }

            const handleLabelChange = (selectedLabel: Label | undefined) => {
                const title = sessions.get(row.original.id)?.title ?? row.original.title
                const newSessions = new Map(sessions).set(row.original.id, { title: title, labelId: selectedLabel?.id ?? undefined })
                setCurrentLabel(labels.find(ld => ld.id === selectedLabel?.id))
                setSessions(newSessions)
            }

            return (
                <div className="flex flex-wrap justify-start gap-6 pl-8 md:pl-4">
                    <div className="flex justify-start gap-8">
                        <TitleTextField variant="standard" defaultValue={row.original.title} placeholder={row.original.title}
                            onBlur={(e) => updateSessionTitle(e.currentTarget.value)}
                            style={{ minWidth: "200px" }} />
                        <LabelCombobox disabled={false} selectedLabel={currentLabel} onLabelChange={handleLabelChange} />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex justify-start gap-2">
                            <CalendarMonthIcon />
                            {dayNames[row.original.end_date.getDay()]}, {row.original.end_date.getDate()}/{row.original.end_date.getMonth()}/{row.original.end_date.getFullYear()}
                        </div>
                        <div className="flex justify-start gap-2">
                            <AccessTimeIcon />
                            {row.original.duration}
                        </div>
                    </div>
                </div>
            )
        }
    },
    {
        id: "delete",
        header: "",
        cell: ({ row }) => {
            const [open, setOpen] = useState(false)
            const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)
            const { user, error, isLoading } = useUser();
            const onSessionDelete = async () => {
                await deleteSessionById(row.original.id)
                setOpen(false)
                setUserAllSessions(user?.sub ?? undefined)
            }

            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" disabled={row.getIsSelected()}>
                            <DeleteIcon className="hover:fill-red-600" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex justify-center">Are you sure you want to delete this session?</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center gap-12 pt-6">
                            <Button onClick={onSessionDelete}>Yes</Button>
                            <Button onClick={() => setOpen(false)}>No</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }
    }
]
