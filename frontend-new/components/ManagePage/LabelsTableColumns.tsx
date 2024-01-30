

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { LabelData, editedLabelsAtom, editedSessionsAtom, labelsAtom, userAllSessionsAtom } from "@/atoms/jotai"
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { DateTimeField } from "@mui/x-date-pickers"
import dayjs from "dayjs"
import { Label } from "recharts"
import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import ColorPicker from "../utils/ColorPicker"


export const labelColumns: ColumnDef<LabelData>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const [editedLabels, setEditedLabels] = useAtom(editedLabelsAtom)
            const updateLabelName = (newName: string) => {
                if (newName == "") {
                    return
                }
                const color = editedLabels.get(row.original.id)?.color ?? row.original.labelColor
                const newEditedLabels = new Map(editedLabels).set(row.original.id, { name: newName, color: color })
                setEditedLabels(newEditedLabels)
            }

            return (
                <Button
                    variant="ghost"
                    role="combobox"
                    className="flex justify-between flex-wrap h-auto group w-full"
                >
                    {
                        <Input
                            className="focus:outline focus:placeholder:text-slate-400 w-full placeholder:text-white"
                            placeholder={row.original.labelName}
                            onBlur={(e) => updateLabelName(e.currentTarget.value)}
                            style={{ backgroundColor: `${row.original.labelColor}` }}
                        />
                    }
                </Button >
            )
        }
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => {
            const [editedLabels, setEditedLabels] = useAtom(editedLabelsAtom)
            const updateLabelColor = (newColor: string) => {
                const name = editedLabels.get(row.original.id)?.name ?? row.original.labelName
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
                        <ColorPicker initialColor={row.original.labelColor} onColorChange={updateLabelColor} />
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
                await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/${user?.sub}/labels`, {
                    method: "POST",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        labels: labels.filter(l => l.id != row.original.id)
                    })
                })
                setOpen(false)
                setLabels(user?.sub)
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
