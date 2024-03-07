'use client'
import { ChangeEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TextField } from "@mui/material";
import { Label, postLabelUpdate } from "@/lib/api_utils/label";
import ColorPicker from "@/components/utils/ColorPicker";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label'



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
                    <div className="flex justify-start gap-4 items-center">
                        <LabelIcon style={{ color: color }} />
                        <TextField variant="standard" placeholder={name} defaultValue={name}
                            InputProps={{ disableUnderline: false }}
                            onChange={handleChangeName} />
                    </div>
                    <Button
                        variant="ghost"
                        className="gap-x-2 w-full h-auto justify-start"
                        asChild
                    >
                        <ColorPicker color={color} onChange={handleChangeColor} />
                    </Button>
                </div>
                <DialogFooter>
                    <Button onClick={handleDialogSubmit}>Edit label</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default NewLabelDialog

