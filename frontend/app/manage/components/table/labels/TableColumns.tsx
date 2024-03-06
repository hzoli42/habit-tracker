

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useState } from "react"
import { Divider, TextField } from "@mui/material"
import { Label } from "@/lib/api_utils/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import EditDialog from "./EditDialog"
import DeleteDialog from "./DeleteDialog"
import { Button } from "@/components/ui/button"
import MoreVertIcon from '@mui/icons-material/MoreVert'



export const labelColumns: ColumnDef<Label>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row, table }) => {
            return (
                <TextField variant="standard" defaultValue={row.original.name} disabled={true}
                    style={{ backgroundColor: `${row.original.color}`, minWidth: "200px", width: "100%", paddingLeft: "10px", borderRadius: "6px", paddingTop: "5px" }}
                    InputProps={{ disableUnderline: true }} />
            )
        }
    },
    {
        accessorKey: "actions",
        header: "",
        cell: ({ row, table }) => {
            const [open, setOpen] = useState(false)

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
                                label={row.original}
                                onDialogSubmit={() => table.options.meta?.onDataChange} />
                            <Divider />
                            <DeleteDialog
                                label={row.original}
                                onDialogSubmit={() => table.options.meta?.onDataChange} />
                        </div>
                    </PopoverContent>
                </Popover>
            )
        }
    }
]
