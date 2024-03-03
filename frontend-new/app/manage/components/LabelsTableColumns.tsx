

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { useAtom } from "jotai"
import { Label, editedLabelsAtom, labelsAtom, } from "@/lib/jotai"
import DeleteIcon from '@mui/icons-material/Delete'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog"
import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import ColorPicker from "../../../components/utils/ColorPicker"
import { deleteLabel } from "@/lib/api_utils"
import { TextField } from "@mui/material"


export const labelColumns: ColumnDef<Label>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const [editedLabels, setEditedLabels] = useAtom(editedLabelsAtom)
            const color = editedLabels.get(row.original.id)?.color ?? row.original.color
            const updateLabelName = (newName: string) => {
                if (newName == "") {
                    return
                }
                const color = editedLabels.get(row.original.id)?.color ?? row.original.color
                const newEditedLabels = new Map(editedLabels).set(row.original.id, { name: newName, color: color })
                setEditedLabels(newEditedLabels)
            }
            return (
                <TextField variant="standard" defaultValue={row.original.name} placeholder={row.original.name}
                    onBlur={(e) => updateLabelName(e.currentTarget.value)}
                    style={{ backgroundColor: `${color}`, minWidth: "200px", width: "100%", paddingLeft: "10px", borderRadius: "6px", paddingTop: "5px" }}
                    InputProps={{ disableUnderline: true }} />
            )
        }
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => {
            const [editedLabels, setEditedLabels] = useAtom(editedLabelsAtom)

            const updateLabelColor = (newColor: string) => {
                const name = editedLabels.get(row.original.id)?.name ?? row.original.name
                const newEditedLabels = new Map(editedLabels).set(row.original.id, { name: name, color: newColor })
                setEditedLabels(newEditedLabels)
            }
            return (
                <div>
                    <Button
                        variant="ghost"
                        className="gap-x-2 w-full h-auto justify-start"
                        asChild
                    >
                        <ColorPicker initialColor={row.original.color} onColorChange={updateLabelColor} />
                    </Button>
                </div>
            )
        },
    },
    {
        accessorKey: "delete",
        header: "",
        cell: ({ row }) => {
            const [open, setOpen] = useState(false)
            const [labels, setLabels] = useAtom(labelsAtom)
            const { user, error, isLoading } = useUser();
            const onLabelDelete = async () => {
                deleteLabel(row.original.id, user?.sub).then(() => {
                    setOpen(false)
                    setLabels(user?.sub)
                })
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
                            <DialogTitle className="flex justify-center">Are you sure you want to delete this label?</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center gap-12 pt-6">
                            <Button onClick={onLabelDelete}>Yes</Button>
                            <Button onClick={() => setOpen(false)}>No</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }
    }
]
