

"use client"

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { LabelCombobox } from "../TrackPage/LabelCombobox"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useEffect, useState } from "react"
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

export default function DataTable() {
    const { user, error, isLoading } = useUser();
    const [data, setData] = useState<Session[]>([])
    const [labels, setLabels] = useAtom(labelsAtom)
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    useEffect(() => {
        if (isLoading) {
            return
        }
        console.log(user)
        fetch(`http://0.0.0.0:5000/session/all/${user?.sub}`, {
            method: "GET",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
        })
            .then(response => response.json())
            .then(response_data => {
                setData(response_data.sessions
                    .map((session: SessionResponse) => {
                        const start = session.actions.filter(a => a.event == "start")[0]
                        const stop = session.actions.filter(a => a.event == "stop")[0]
                        const durationObject = new Date(stop.timestamp * 1000 - start.timestamp * 1000)
                        return {
                            id: session.id,
                            title: session.title,
                            labels: session.labels,
                            duration: `${durationObject.getUTCHours()}h ${durationObject.getUTCMinutes()}m ${durationObject.getUTCSeconds()}s`,
                            date: new Date(start.timestamp * 1000).toDateString()
                        }
                    })
                )
            })
    }, [isLoading])

    function onLabelsChange(selectedLabels: string[], session_id: string) {

    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => {
                                    console.log(cell)
                                    console.log(cell.getValue())
                                    if (cell.column.id == "labels") {
                                        const currentLabels = cell.getValue<string[]>()
                                        return (
                                            <TableCell>
                                                <LabelCombobox startingLabels={currentLabels} />
                                            </TableCell>
                                        )

                                    } else {
                                        return (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        )
                                    }
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

