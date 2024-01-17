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


export type LabelComboboxProps = {
    labels: string[]
    setLabels: Dispatch<SetStateAction<string[]>>
    labelValues: string[]
    setLabelValues: Dispatch<SetStateAction<string[]>>
}

export function LabelCombobox({ labels, setLabels, labelValues, setLabelValues }: LabelComboboxProps) {
    const [open, setOpen] = useState(false)
    const [labelSearchInput, setLabelSearchInput] = useState("")



    function handleDelete(currentValue: string) {
        console.info("You clicked the delete button on a Chip component")
        setLabelValues(labelValues.filter(v => v != currentValue))
    }

    function onSelectLabel(currentValue: string) {
        let newValues: string[] = []
        !labelValues.includes(currentValue)
            ? newValues = labelValues.concat([currentValue])
            : newValues = labelValues.filter(v => v != currentValue)
        setLabelValues(newValues)
    }

    function addNewLabel() {
        if (!labelValues.includes(labelSearchInput)) {
            setLabelValues(labelValues.concat(labelSearchInput))
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex justify-between flex-wrap h-auto"
                >
                    {
                        labelValues.length != 0
                            ? labelValues.map(value => <Chip label={value} onDelete={() => handleDelete(value)} />)
                            : "Select labels..."
                    }
                    {labelValues.length == 0 && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
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
                                            labelValues.includes(label) ? "opacity-100" : "opacity-0"
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
