

"use client"

import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Key, useEffect, useState } from "react"
import { useAtom } from "jotai"
import { labelsAtom } from "@/atoms/jotai"
import { Button } from "../ui/button"
import { ChevronsUpDown } from "lucide-react"


export type SessionResponse = {
    id: string,
    title: string,
    user_id: string,
    labels: string[],
    actions: [
        {
            timestamp: number,
            stopwatch_time: {
                hours: number,
                minutes: number,
                seconds: number
            },
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
            const onTitleChange = (title: string) => {
                fetch(`http://0.0.0.0:5000/session/${row.original.id}/title`, {
                    method: "POST",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        title: title
                    })
                })
            }

            return (
                <Button
                    variant="ghost"
                    role="combobox"
                    className="flex justify-between flex-wrap h-auto group w-full"
                >
                    {
                        <input
                            className="focus:outline focus:placeholder:text-white w-full placeholder:text-black"
                            placeholder={row.original.title}
                            onBlur={(e) => onTitleChange(e.currentTarget.value)} />
                    }
                </Button>
            )
        }
    },
    {
        accessorKey: "labels",
        header: "Labels",
        cell: ({ row }) => {
            const onLabelsChange = (selectedLabels: string[]) => {
                fetch(`http://0.0.0.0:5000/session/${row.original.id}/labels`, {
                    method: "POST",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        labels: selectedLabels
                    })
                })
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
