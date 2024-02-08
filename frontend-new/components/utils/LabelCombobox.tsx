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
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from "@mui/material"

export type LabelComboboxProps = {
    selectedLabel?: Label
    onLabelChange?: (selectedLabel: Label | undefined) => void
    disabled: boolean
}

export function LabelCombobox({ selectedLabel, onLabelChange, disabled }: LabelComboboxProps) {
    const [labels, setLabels] = useAtom(labelsAtom)
    const { user, error, isLoading } = useUser();
    const [open, setOpen] = useState(false)
    const [labelSearchInput, setLabelSearchInput] = useState("")
    const [newLabelColor, setNewLabelColor] = useState("#F5F3E7")

    function onSelectLabel(currentValue: string | undefined) {
        setOpen(false)
        if (currentValue === undefined) {
            onLabelChange ? onLabelChange(currentValue) : null
            return
        }

        const newSelectedLabel = labels.find(ld => ld.id === currentValue) ??
            { id: "", user_id: "", name: "Error", color: "#9E9E9E" }
        onLabelChange ? onLabelChange(newSelectedLabel) : null
    }

    async function addNewLabel() {
        setOpen(false)
        postNewLabel(user?.sub, labelSearchInput, newLabelColor)
            .then(response => response.json())
            .then((data: Label) => {
                setLabels(user?.sub ?? undefined).then(() => {
                    const newLabel = labels.find(ld => ld.id === data.id) ?? { id: "", user_id: "", name: "Error", color: "#9E9E9E" }
                    onLabelChange ? onLabelChange(newLabel) : null
                })
            })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={disabled}>
                <div className=" flex justify-start min-w-[130px]">
                    {
                        selectedLabel !== undefined
                            ?
                            <div style={{ backgroundColor: `${selectedLabel.color}` }}
                                className="min-h-[20px] rounded-md px-2 py-1">
                                <p>{selectedLabel.name}</p>
                            </div>
                            : <>
                                <p className="text-gray-500">Select a label</p>
                                <ArrowDropDownIcon style={{ color: "#9E9E9E", marginLeft: "5px" }} />
                            </>
                    }
                </div>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto min-w-sm max-w-lg">
                <Command>
                    <CommandInput className="placeholder-gray-500" placeholder="Select labels..." onValueChange={(v) => setLabelSearchInput(v)} />
                    <CommandEmpty>
                        <div className="flex justify-between w-full px-2 items-center">
                            <Button
                                variant="ghost"
                                onClick={addNewLabel}
                                className="gap-x-2 w-full h-auto justify-start"
                            >
                                <AddIcon className="fill-black" />
                                <div style={{ backgroundColor: newLabelColor }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                    <p>{labelSearchInput}</p>
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
                                        className="flex justify-start items-center items-center w-full"
                                    >
                                        {(selectedLabel?.id ?? "") === label.id &&
                                            <Check className={cn("mr-2 h-4 w-4")} />
                                        }

                                        <div style={{ backgroundColor: `${label.color}` }} className="flex min-h-[20px] rounded-lg px-2 py-1 inline">
                                            <p>{label.name}</p>
                                        </div>
                                    </CommandItem>
                                    {(selectedLabel?.id ?? "") === label.id &&
                                        <IconButton style={{ borderRadius: 0 }} onClick={() => onSelectLabel(undefined)}>
                                            <CloseIcon className={cn("h-4 w-4")} />
                                        </IconButton>
                                    }
                                </div>
                            ))
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
