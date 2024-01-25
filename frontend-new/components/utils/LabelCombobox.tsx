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
    startingLabel?: LabelData
    onLabelChange?: (selectedLabel: LabelData) => void
    disabled: boolean
}

export function LabelCombobox({ startingLabel, onLabelChange, disabled }: LabelComboboxProps) {
    const [open, setOpen] = useState(false)
    const [labelSearchInput, setLabelSearchInput] = useState("")
    const [selectedLabel, setSelectedLabel] = useState<LabelData | undefined>(startingLabel)
    const [newLabelColor, setNewLabelColor] = useState("9B9B9B")
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)


    function onSelectLabel(currentValue: string) {
        const newSelectedLabel = labels.find(ld => ld.labelName == currentValue) ?? { labelName: "Error", labelColor: "9B9B9B" }
        setSelectedLabel(newSelectedLabel)
        onLabelChange ? onLabelChange(newSelectedLabel) : null
    }

    async function addNewLabel() {
        setOpen(false)
        const newLabel = { labelName: labelSearchInput, labelColor: newLabelColor }
        const newLabels = labels.concat(newLabel)
        await fetch(`http://0.0.0.0:5000/user/${user?.sub}/labels`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: `${user?.sub}`,
                labels: newLabels,
            })
        })
        setLabels(user?.sub)
        setSelectedLabel(newLabel)
        onLabelChange ? onLabelChange(newLabel) : null
    }

    async function modifyLabelColor(labelName: string, labelColor: string) {
        const newLabel = { labelName: labelName, labelColor: labelColor }
        const newLabels = labels.filter(l => l.labelName != labelName).concat(newLabel)
        await fetch(`http://0.0.0.0:5000/user/${user?.sub}/labels`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: `${user?.sub}`,
                labels: newLabels,
            })
        })
        setLabels(user?.sub)
    }

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
                        selectedLabel != undefined
                            ? <div style={{ backgroundColor: `${selectedLabel.labelColor}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                <p className="text-white">{selectedLabel.labelName}</p>
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
                                <div style={{ backgroundColor: `${newLabelColor}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                    <p className="text-white">{labelSearchInput}</p>
                                </div>
                            </Button>
                            <ColorPicker initialColor={newLabelColor} onColorChange={(color) => (setNewLabelColor(color))} />
                        </div>
                    </CommandEmpty>
                    <CommandGroup>
                        {
                            labels.map(label => (
                                <div className="flex justify-between">
                                    <CommandItem
                                        key={label.labelName}
                                        value={label.labelName}
                                        onSelect={onSelectLabel}
                                        className="flex justify-start items-center w-full"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                JSON.stringify(selectedLabel) === JSON.stringify(label) ? "opacity-100" : "opacity-0"
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
