'use client'
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { ChangeEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TextField } from "@mui/material";
import { postLabelNew } from "@/lib/api_utils/label";
import ColorPicker from "@/components/utils/ColorPicker";

type Props = {
    onDialogSubmit: () => void
}

function NewLabelDialog({ onDialogSubmit }: Props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("N/A")
    const [color, setColor] = useState("#F5F3E7")
    const { user } = useUser();

    async function handleClickSubmit() {
        await postLabelNew(user?.sub, name, color).then(() => {
            setOpen(false)
            setName("N/A")
            setColor("#F5F3E7")
            onDialogSubmit()
        })
    }

    function handleChangeTextField(e: ChangeEvent<HTMLInputElement>) {
        setName(e.currentTarget.value)
    }

    function handleChangeColorPicker(color: string) {
        setColor(color)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-green-500 hover:bg-green-600">
                    + New
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
                        onChange={handleChangeTextField} />
                    <Button
                        variant="ghost"
                        className="gap-x-2 w-full h-auto justify-start"
                        asChild
                    >
                        <ColorPicker color={color} onChange={handleChangeColorPicker} />
                    </Button>
                </div>
                <DialogFooter>
                    <Button onClick={handleClickSubmit}>Create label</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default NewLabelDialog

