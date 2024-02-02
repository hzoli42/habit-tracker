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
import { Label, labelsAtom } from "@/atoms/jotai"
import ColorPicker from "./ColorPicker"
import AddIcon from '@mui/icons-material/Add';
import { postNewLabel } from "@/lib/api_utils"


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
    const [selectedLabelData, setSelectedLabelData] = useState<Label | undefined>(undefined)
    const [newLabelColor, setNewLabelColor] = useState("#000000")

    useEffect(() => {
        if (isLoading) {
            return
        }
        setLabels(user?.sub ?? undefined)
        console.log(labels)
    }, [isLoading])

    useEffect(() => {
        const newSelectedLabelData = labels.find(ld => ld.id === selectedLabel)
        setSelectedLabelData(newSelectedLabelData)
    }, [labels])


    function onSelectLabel(currentValue: string) {
        const newSelectedLabel = labels.find(ld => ld.id === currentValue) ??
            { id: "", user_id: "", name: "Error", color: "9B9B9B" }
        setSelectedLabel(newSelectedLabel.id)
        setSelectedLabelData(newSelectedLabel)
        onLabelChange ? onLabelChange(newSelectedLabel.id) : null
    }

    async function addNewLabel() {
        setOpen(false)
        postNewLabel(user?.sub, labelSearchInput, newLabelColor)
            .then(response => response.json())
            .then((data: Label) => {
                setSelectedLabel(data.id)
                setSelectedLabelData(data)
                setLabels(user?.sub ?? undefined)
                onLabelChange ? onLabelChange(data.id) : null
            })
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
                        selectedLabel != undefined && selectedLabelData != undefined
                            ?
                            <div style={{ backgroundColor: `${selectedLabelData.color}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                <p className="text-white">{selectedLabelData.name}</p>
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
                                        <div style={{ backgroundColor: `${label.color}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                            <p className="text-white">{label.name}</p>
                                        </div>
                                    </CommandItem>
                                </div>
                            ))
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
