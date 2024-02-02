'use client'
import { DateTimeField } from "@mui/x-date-pickers";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { LabelCombobox } from "../utils/LabelCombobox";
import dayjs from "dayjs";
import { FormEvent, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { labelsAtom, userAllSessionsAtom } from "@/atoms/jotai";
import { useAtom } from "jotai";
import { postNewLabel, postSessionStart, postSessionStop } from "@/lib/api_utils";
import ColorPicker from "../utils/ColorPicker";

export default function NewSessionDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("N/A")
    const [color, setColor] = useState("#000000")
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)

    async function onDialogSubmit() {
        let sessionId = ""
        postNewLabel(user?.sub, name, color).then(() => {
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
                <div className="flex items-center gap-4 py-4">
                    <Button
                        variant="ghost"
                        role="combobox"
                        className="flex justify-between flex-wrap h-auto group w-full"
                    >
                        <Input
                            className="focus:outline placeholder:text-slate-200 focus:placeholder:text-slate-200 w-full  focus:text-white text-white"
                            placeholder="Enter label name"
                            style={{ backgroundColor: `${color}` }}
                            onChange={(e) => setName(e.currentTarget.value)}
                        />
                    </Button >
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

