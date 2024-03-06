'use client'
import { ChangeEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TextField } from "@mui/material";
import { Label, postLabelUpdate } from "@/lib/api_utils/label";
import ColorPicker from "@/components/utils/ColorPicker";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditIcon from '@mui/icons-material/Edit';


type Props = {
    label: Label
    onDialogSubmit: () => void
}

function NewLabelDialog({ label, onDialogSubmit }: Props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(label.name)
    const [color, setColor] = useState(label.color)
    const { user } = useUser();

    function handleChangeName(e: ChangeEvent<HTMLInputElement>) {
        setName(e.currentTarget.value)
    }

    function handleChangeColor(color: string) {
        setColor(color)
    }

    function handleDialogSubmit() {
        setOpen(false)
        postLabelUpdate(label.label_id, user?.sub, name, color).then(() => {
            onDialogSubmit()
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex justify-start gap-2">
                    <EditIcon /> edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enter label details</DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-4 py-4 justify-between h-auto">
                    <TextField variant="standard" placeholder="Enter label name"
                        style={{ backgroundColor: `${color}`, minWidth: "200px", width: "100%", paddingLeft: "10px", borderRadius: "6px", paddingTop: "5px" }}
                        InputProps={{ disableUnderline: true }}
                        onChange={handleChangeName} />
                    <Button
                        variant="ghost"
                        className="gap-x-2 w-full h-auto justify-start"
                        asChild
                    >
                        <ColorPicker color={color} onChange={handleChangeColor} />
                    </Button>
                </div>
                <DialogFooter>
                    <Button onClick={handleDialogSubmit}>Create label</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default NewLabelDialog

