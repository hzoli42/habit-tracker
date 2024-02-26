'use client'
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { labelsAtom } from "@/atoms/jotai";
import { useAtom } from "jotai";
import { postLabelNew } from "@/lib/api_utils";
import ColorPicker from "../utils/ColorPicker";
import { TextField } from "@mui/material";

export default function NewSessionDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("N/A")
    const [color, setColor] = useState("#F5F3E7")
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)

    async function onDialogSubmit() {
        let sessionId = ""
        postLabelNew(user?.sub, name, color).then(() => {
            setOpen(false)
            setLabels(user?.sub)
        })

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
                        onChange={(e) => setName(e.currentTarget.value)} />
                    <Button
                        variant="ghost"
                        className="gap-x-2 w-full h-auto justify-start"
                        asChild
                    >
                        <ColorPicker initialColor={color} onColorChange={(color) => setColor(color)} />
                    </Button>
                </div>
                <DialogFooter>
                    <Button onClick={onDialogSubmit}>Create session</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

