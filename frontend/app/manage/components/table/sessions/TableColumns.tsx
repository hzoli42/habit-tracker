

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LabelCombobox from "@/components/utils/LabelCombobox"
import { Session } from "@/lib/api_utils/session"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EditDialog from "./EditDialog"
import DeleteDialog from "./DeleteDialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Typography } from "@material-tailwind/react"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Button } from "@/components/ui/button"
import TitleIcon from '@mui/icons-material/Title'
import LabelIcon from '@mui/icons-material/Label'




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
        id: "title",
        header: () => (
            <div className="flex justify-start gap-1">
                <TitleIcon /> Title
            </div>
        ),
        cell: ({ row, table }) => {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            return (
                <div className="flex flex-nowrap whitespace-nowrap text-nowrap justify-start gap-2">
                    <Typography variant="h5" className="underline underline-offset-4">{row.original.title}</Typography>
                </div>
            )
        }
    },
    {
        id: "label",
        header: () => (
            <div className="flex justify-start gap-2 pl-3">
                <LabelIcon /> Label
            </div>
        ),
        cell: ({ row, table }) => {
            return (
                <div className="flex flex-nowrap whitespace-nowrap text-nowrap">
                    <LabelCombobox
                        disabled={true}
                        value={table.options.meta?.labels?.find(l => l.label_id === row.original.label_id)}
                        labels={table.options.meta?.labels ?? []}
                    />
                </div>
            )
        }
    },
    {
        id: "date",
        header: () => (
            <div className="flex justify-start gap-2">
                <CalendarMonthIcon /> Date
            </div>
        ),
        cell: ({ row, table }) => {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            return (
                <div className="flex flex-nowrap whitespace-nowrap text-nowrap ">
                    {dayNames[row.original.end_date.getDay()]}, {row.original.end_date.getDate()}/{row.original.end_date.getMonth()}/{row.original.end_date.getFullYear()}
                </div>

            )
        }
    },
    {
        id: "duration",
        header: () => (
            <div className="flex justify-end gap-2">
                <AccessTimeIcon /> Duration
            </div>
        ),
        cell: ({ row }) => {
            return (
                <div className="flex flex-nowrap whitespace-nowrap text-nowrap justify-end">
                    {row.original.duration}
                </div>
            )
        }
    },
    {
        id: "actions",
        header: "",
        cell: ({ row, table }) => {
            const [open, setOpen] = useState(false)

            function handleDialogSubmit() {
                setOpen(false)
                table.options.meta?.onDataChange()
            }

            return (
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger disabled={row.getIsSelected()}>
                        <Button variant="ghost">
                            <MoreVertIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto min-w-sm max-w-lg">
                        <div className="grid grid-cols-1">
                            <EditDialog
                                session={row.original}
                                labels={table.options.meta?.labels ?? []}
                                onNewLabel={() => table.options.meta?.onDataChange()}
                                onDialogSubmit={handleDialogSubmit} />
                            {/* <Divider /> */}
                            <DeleteDialog
                                session={row.original}
                                onDialogSubmit={handleDialogSubmit} />
                        </div>
                    </PopoverContent>
                </Popover>
            )
        }
    }
]
