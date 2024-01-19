

"use client"

import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { useUser } from "@auth0/nextjs-auth0/client"
import { Key, useEffect, useState } from "react"
import { useAtom } from "jotai"
import { labelsAtom } from "@/atoms/jotai"


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
