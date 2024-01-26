

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LabelCombobox } from "../utils/LabelCombobox"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useAtom } from "jotai"
import { LabelData, editedSessionsAtom, userAllSessionsAtom } from "@/atoms/jotai"
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
            return (
                <div style={{ backgroundColor: `${row.original.labelColor}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                    <p className="text-white">{row.original.labelName}</p>
                </div>
            )
        }
    },
    {
        accessorKey: "color",
        header: "Color",
        cell: ({ row }) => {
            return (
                <div>
                    <Button
                        variant="ghost"
                        className="gap-x-2 w-full h-auto justify-start"
                    >
                        <ColorPicker initialColor={row.original.labelColor} onColorChange={(color) => (setNewLabelColor(color))} />
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
            const [userAllSessions, setUserAllSessions] = useAtom(userAllSessionsAtom)
            const { user, error, isLoading } = useUser();
            const onSessionDelete = async () => {
                await fetch(`http://0.0.0.0:5000/session/${row.original.id}`, {
                    method: "DELETE",
                    mode: "cors",
                    headers: { "Content-Type": "application/json" },
                })
                setOpen(false)
                setUserAllSessions(user?.sub)
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
                            <DialogTitle className="flex justify-center">Are you sure you want to delete this session?</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center gap-12 pt-6">
                            <Button onClick={onSessionDelete}>Yes</Button>
                            <Button onClick={() => setOpen(false)}>No</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }
    }
]
