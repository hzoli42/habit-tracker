

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LabelCombobox from "@/components/utils/LabelCombobox"
import { Session } from "@/lib/api_utils/session"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Divider } from "@mui/material"
import EditDialog from "./EditDialog"
import DeleteDialog from "./DeleteDialog"
import { Checkbox } from "@/components/ui/checkbox"
import { TitleTextField } from "@/components/utils/TitleTextField"
import { IconButton } from "@material-tailwind/react"
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Button } from "@/components/ui/button"



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
        cell: ({ row, table }) => {
            const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            return (
                <div className="flex flex-wrap justify-start gap-6 pl-8 md:pl-4">
                    <div className="flex justify-start gap-8">
                        <TitleTextField variant="standard" defaultValue={row.original.title}
                            style={{ minWidth: "200px" }}
                            disabled={true} />
                        <LabelCombobox
                            disabled={true}
                            value={table.options.meta?.labels?.find(l => l.label_id === row.original.label_id)}
                            labels={table.options.meta?.labels ?? []}
                        />
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
                            <Divider />
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
