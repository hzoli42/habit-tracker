

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { LabelData, Session, editedSessionsAtom, userAllSessionsAtom } from "@/atoms/jotai"
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DateTimeField } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { Label } from "recharts"
import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"

export const sessionColumns: ColumnDef<Session>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const [sessions, setSessions] = useAtom(editedSessionsAtom)
            const updateSessionTitle = (newTitle: string) => {
                if (newTitle == "") {
                    return
                }
                const label_id = sessions.get(row.original.id)?.label_id ?? row.original.label_id
                const newSessions = new Map(sessions).set(row.original.id, { title: newTitle, label_id: label_id })
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
            const onLabelChange = (selectedLabel: string) => {
                const title = sessions.get(row.original.id)?.title ?? row.original.title
                const newSessions = new Map(sessions).set(row.original.id, { title: title, label_id: selectedLabel })
                console.log('session labels change')
                setSessions(newSessions)
            }
            return <LabelCombobox disabled={false} startingLabel={row.original.label_id} onLabelChange={onLabelChange} />
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            return row.original.start_date.toDateString()
        }
    },
    {
        accessorKey: "delete",
        header: "",
        cell: ({ row }) => {
            const [open, setOpen] = useState(false)
            const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)
            const { user, error, isLoading } = useUser();
            const onSessionDelete = async () => {
                await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/session/${row.original.id}`, {
                    method: "DELETE",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                })
                setOpen(false)
                setUserAllSessions(user?.sub)
            }

            return (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost">
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
