import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Chip from '@mui/material/Chip'
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useAtom } from "jotai"
import { LabelData, labelsAtom } from "@/atoms/jotai"
import ColorPicker from "./ColorPicker"
import AddIcon from '@mui/icons-material/Add';


export type LabelComboboxProps = {
    startingLabel?: string
    onLabelChange?: (selectedLabel: string) => void
    disabled: boolean
}

export function LabelCombobox({ startingLabel, onLabelChange, disabled }: LabelComboboxProps) {
    const [labels, setLabels] = useAtom(labelsAtom)
    const { user, error, isLoading } = useUser();
    const [open, setOpen] = useState(false)
    const [labelSearchInput, setLabelSearchInput] = useState("")
    const [selectedLabel, setSelectedLabel] = useState<string | undefined>(startingLabel)
    const [selectedLabelData, setSelectedLabelData] = useState<LabelData | undefined>(undefined)
    const [newLabelColor, setNewLabelColor] = useState("#000000")

    useEffect(() => {
        if (isLoading) {
            return
        }
        setLabels(user?.sub)
    }, [isLoading])

    useEffect(() => {
        const newSelectedLabelData = labels.find(ld => ld.id === selectedLabel)
        setSelectedLabelData(newSelectedLabelData)
    }, [labels])


    function onSelectLabel(currentValue: string) {
        const newSelectedLabel = labels.find(ld => ld.id === currentValue) ?? { id: "", labelName: "Error", labelColor: "9B9B9B" }
        setSelectedLabel(newSelectedLabel.id)
        setSelectedLabelData(newSelectedLabel)
        onLabelChange ? onLabelChange(newSelectedLabel.id) : null
    }

    async function addNewLabel() {
        setOpen(false)
        const newLabel = { id: "", labelName: labelSearchInput, labelColor: newLabelColor }
        const newLabels = labels.concat(newLabel)
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/user/${user?.sub}/labels`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: `${user?.sub}`,
                labels: newLabels,
            })
        })
            .then(response => response.json())
            .then(data => {
                setSelectedLabel(data[0].id)
                setSelectedLabelData({ id: data[0].id, labelName: data[0].labelName, labelColor: data[0].labelColor })
            })
        setLabels(user?.sub)
        onLabelChange ? onLabelChange(newLabel.id) : null
    }

    // async function modifyLabelColor(labelName: string, labelColor: string) {
    //     const newLabel = { labelName: labelName, labelColor: labelColor }
    //     const newLabels = labels.filter(l => l.labelName != labelName).concat(newLabel)
    //     await fetch(`http://0.0.0.0:5000/user/${user?.sub}/labels`, {
    //         method: "POST",
    //         mode: "cors",
    //         headers: { "Content-Type": "application/json" },
    //         body: JSON.stringify({
    //             id: `${user?.sub}`,
    //             labels: newLabels,
    //         })
    //     })
    //     setLabels(user?.sub)
    // }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex justify-between flex-wrap h-auto group w-full truncate"
                >
                    {
                        selectedLabel != undefined && selectedLabelData != undefined
                            ?
                            <div style={{ backgroundColor: `${selectedLabelData.labelColor}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                <p className="text-white">{selectedLabelData.labelName}</p>
                            </div>
                            : <>
                                <p className="text-gray-500">Select a label</p>
                            </>
                    }
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto min-w-sm max-w-lg">
                <Command>
                    <CommandInput placeholder="Select labels..." onValueChange={(v) => setLabelSearchInput(v)} />
                    <CommandEmpty>
                        <div className="flex justify-between w-full px-2 items-center">
                            <Button
                                variant="ghost"
                                onClick={addNewLabel}
                                className="gap-x-2 w-full h-auto justify-start"
                            >
                                <AddIcon className="fill-black" />
                                <div style={{ backgroundColor: newLabelColor }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                    <p className="text-white">{labelSearchInput}</p>
                                </div>
                            </Button>
                            <ColorPicker initialColor={newLabelColor} onColorChange={(color) => (setNewLabelColor(color))} />
                        </div>
                    </CommandEmpty>
                    <CommandGroup>
                        {
                            labels.map(label => (
                                <div className="flex justify-between" key={label.id}>
                                    <CommandItem
                                        key={label.id}
                                        value={label.id}
                                        onSelect={onSelectLabel}
                                        className="flex justify-start items-center w-full"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                (selectedLabel ?? "") === label.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <div style={{ backgroundColor: `${label.labelColor}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                            <p className="text-white">{label.labelName}</p>
                                        </div>
                                    </CommandItem>
                                    {/* <ColorPicker initialColor={label.labelColor} onColorChange={(color) => modifyLabelColor(label.labelName, color)} /> */}
                                </div>
                            ))
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
