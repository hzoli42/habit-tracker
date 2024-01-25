

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { LabelData, editedSessionsAtom } from "@/atoms/jotai"
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DateTimeField } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { Label } from "recharts"
import { useState } from "react"


export type SessionResponse = {
    id: string,
    title: string,
    user_id: string,
    label: LabelData,
    actions: [
        {
            timestamp: number,
            event: string
        }
    ]
}

export type Session = {
    id: string
    title: string
    label: LabelData
    duration: string
    date: string
}

export const columns: ColumnDef<Session>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const [sessions, setSessions] = useAtom(editedSessionsAtom)
            const updateSessionTitle = (newTitle: string) => {
                if (newTitle == "") {
                    return
                }
                const label = sessions.get(row.original.id)?.label ?? row.original.label
                const newSessions = new Map(sessions).set(row.original.id, { title: newTitle, label: label })
                console.log('session title change')
                setSessions(newSessions)
            }

            return (
                <Button
                    variant="ghost"
                    role="combobox"
                    className="flex justify-between flex-wrap h-auto group w-full"
                >
                    {
                        <Input
                            className="focus:outline focus:placeholder:text-slate-400 w-full placeholder:text-black"
                            placeholder={row.original.title}
                            onBlur={(e) => updateSessionTitle(e.currentTarget.value)} />
                    }
                </Button>
            )
        }
    },
    {
        accessorKey: "labels",
        header: "Labels",
        cell: ({ row }) => {
            const [sessions, setSessions] = useAtom(editedSessionsAtom)
            const onLabelChange = (selectedLabel: LabelData) => {
                const title = sessions.get(row.original.id)?.title ?? row.original.title
                const newSessions = new Map(sessions).set(row.original.id, { title: title, label: selectedLabel })
                console.log('session labels change')
                setSessions(newSessions)
            }
            return <LabelCombobox disabled={false} startingLabel={row.original.label} onLabelChange={onLabelChange} />
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "delete",
        header: "",
        cell: ({ row }) => {
            const onSessionDelete = () => {

            }
            const [open, setOpen] = useState(false)
            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
                            <DeleteIcon className="hover:fill-red-600" onClick={onSessionDelete} />
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
