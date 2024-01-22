

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { editedSessionsAtom } from "@/atoms/jotai"


export type SessionResponse = {
    id: string,
    title: string,
    user_id: string,
    labels: string[],
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
    labels: string[]
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
                const labels = sessions.get(row.original.id)?.labels ?? row.original.labels
                const newSessions = new Map(sessions).set(row.original.id, { title: newTitle, labels: labels })
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
                            className="focus:outline focus:placeholder:text-white w-full placeholder:text-black"
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
            const onLabelsChange = (selectedLabels: string[]) => {
                const title = sessions.get(row.original.id)?.title ?? row.original.title
                const newSessions = new Map(sessions).set(row.original.id, { title: title, labels: selectedLabels })
                console.log('session labels change')
                setSessions(newSessions)
            }
            return <LabelCombobox startingLabels={row.original.labels} onLabelsChange={onLabelsChange} />
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
