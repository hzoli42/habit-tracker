

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
import ColorLensIcon from '@mui/icons-material/ColorLens';
import TitleIcon from '@mui/icons-material/Title';
import { Typography } from "@material-tailwind/react"
import LabelIcon from '@mui/icons-material/Label'





export const labelColumns: ColumnDef<Label>[] = [
    {
        accessorKey: "labels",
        header: () => (
            <div className="flex justify-start gap-2 pl-4">
                <LabelIcon /> Labels
            </div>
        ),
        cell: ({ row, table }) => {
            return (
                <div className="flex flex-nowrap whitespace-nowrap text-nowrap justify-start gap-2 pl-4">
                    <LabelIcon style={{ color: row.original.color }} />
                    <Typography variant="h5" className="underline underline-offset-4">
                        {row.original.name}
                    </Typography>
                </div>
            )
        }
    },
    {
        accessorKey: "actions",
        header: "",
        cell: ({ row, table }) => {
            const [open, setOpen] = useState(false)

            function handleDialogSubmit() {
                setOpen(false)
                table.options.meta?.onDataChange()
            }

            return (
                <div className="flex justify-end">
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
                                    onDialogSubmit={handleDialogSubmit} />
                                <DeleteDialog
                                    label={row.original}
                                    onDialogSubmit={handleDialogSubmit} />
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            )
        }
    }
]
