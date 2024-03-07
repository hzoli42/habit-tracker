'use client'
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../components/ui/dialog";
import { ChangeEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { TextField } from "@mui/material";
import { postLabelNew } from "@/lib/api_utils/label";
import ColorPicker from "@/components/utils/ColorPicker";
import LabelIcon from '@mui/icons-material/Label'


type Props = {
    onDialogSubmit: () => void
}

function NewLabelDialog({ onDialogSubmit }: Props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("N/A")
    const [color, setColor] = useState("#ef476f")
    const { user } = useUser();

    async function handleClickSubmit() {
        await postLabelNew(user?.sub, name, color).then(() => {
            setOpen(false)
            setName("N/A")
            setColor("#ef476f")
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
                    <div className="flex items-center gap-4 py-4 justify-between h-auto">
                        <div className="flex justify-start gap-4 items-center">
                            <LabelIcon style={{ color: color }} />
                            <TextField variant="standard" placeholder="Enter label name"
                                InputProps={{ disableUnderline: false }}
                                onChange={handleChangeTextField} />
                        </div>
                        <Button
                            variant="ghost"
                            className="gap-x-2 w-full h-auto justify-start"
                            asChild
                        >
                            <ColorPicker color={color} onChange={handleChangeColorPicker} />
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleClickSubmit}>Create label</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default NewLabelDialog

