

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { Session, editedSessionsAtom, userAllSessionsAtom } from "@/atoms/jotai"
import DeleteIcon from '@mui/icons-material/Delete'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { deleteSessionById } from "@/lib/api_utils"

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
                const label_id = sessions.get(row.original.id)?.labelId ?? row.original.label_id
                const newSessions = new Map(sessions).set(row.original.id, { title: newTitle, labelId: label_id })
                console.log('session title change')
                setSessions(newSessions)
            }

            return (
                <Button
                    variant="ghost"
                    role="combobox"
                    className="flex justify-between flex-wrap h-auto group min-w-[200px]"
                >
                    {
                        <Input
                            className="focus:outline focus:placeholder:text-gray-500 w-full placeholder:text-black"
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
                const newSessions = new Map(sessions).set(row.original.id, { title: title, labelId: selectedLabel })
                console.log('session labels change')
                setSessions(newSessions)
            }
            return <LabelCombobox disabled={false} startingLabel={row.original.label_id} onLabelChange={onLabelChange} />
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
            return <p className="min-w-[90px]">{row.original.duration}</p>
        }
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            return <p className="min-w-[150px]">{row.original.start_date.toDateString()}</p>
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
                await deleteSessionById(row.original.id)
                setOpen(false)
                setUserAllSessions(user?.sub ?? undefined)
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
