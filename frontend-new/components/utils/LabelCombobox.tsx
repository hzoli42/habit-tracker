import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

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
import { Dispatch, SetStateAction, useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useAtom } from "jotai"
import { labelsAtom } from "@/atoms/jotai"


export type LabelComboboxProps = {
    startingLabels?: string[]
    onLabelsChange?: (selectedLabels: string[]) => void
    disabled: boolean
}

export function LabelCombobox({ startingLabels, onLabelsChange, disabled }: LabelComboboxProps) {
    const [open, setOpen] = useState(false)
    const [labelSearchInput, setLabelSearchInput] = useState("")
    const [selectedLabels, setSelectedLabels] = useState<string[]>(startingLabels ?? [])
    const { user, error, isLoading } = useUser();
    const [labels, setLabels] = useAtom(labelsAtom)


    function handleDelete(currentValue: string) {
        console.info("You clicked the delete button on a Chip component")
        const newSelectedLabels = selectedLabels.filter(v => v != currentValue)
        setSelectedLabels(newSelectedLabels)
        onLabelsChange ? onLabelsChange(newSelectedLabels) : null
    }

    function onSelectLabel(currentValue: string) {
        let newSelectedLabels: string[] = []
        !selectedLabels.includes(currentValue)
            ? newSelectedLabels = selectedLabels.concat([currentValue])
            : newSelectedLabels = selectedLabels.filter(v => v != currentValue)
        setSelectedLabels(newSelectedLabels)
        onLabelsChange ? onLabelsChange(newSelectedLabels) : null
    }

    async function addNewLabel() {
        const newLabels = labels.concat([labelSearchInput])
        await fetch(`http://0.0.0.0:5000/user/${user?.sub}/labels`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: `${user?.sub}`,
                labels: newLabels,
            })
        })
        if (!selectedLabels.includes(labelSearchInput)) {
            const newSelectedLabels = selectedLabels.concat([labelSearchInput])
            setSelectedLabels(newSelectedLabels)
            onLabelsChange ? onLabelsChange(newSelectedLabels) : null
        }
        setLabels(user?.sub)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex justify-between flex-wrap h-auto group w-full"
                >
                    {
                        selectedLabels.length != 0
                            ? selectedLabels.map(value => <Chip label={value} onDelete={() => handleDelete(value)} />)
                            :
                            <>
                                <p className="text-gray-500">Select labels...</p>
                                <ChevronsUpDown className="hidden group-hover:block shrink-0 opacity-50" />
                            </>

                    }


                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Select labels..." onValueChange={(v) => setLabelSearchInput(v)} />
                    <CommandEmpty>
                        <Button
                            variant="outline"
                            onClick={addNewLabel}
                            className="flex justify-center gap-4 w-full px-8"
                        >
                            <p>+ add new label</p>
                            <Chip label={labelSearchInput} />
                        </Button>
                    </CommandEmpty>
                    <CommandGroup>
                        {
                            labels.map(label => (
                                <CommandItem
                                    key={label}
                                    value={label}
                                    onSelect={onSelectLabel}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedLabels.includes(label) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {label}
                                </CommandItem>

                            ))
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}