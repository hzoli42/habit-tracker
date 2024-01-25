

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { LabelData, editedSessionsAtom } from "@/atoms/jotai"


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
]
