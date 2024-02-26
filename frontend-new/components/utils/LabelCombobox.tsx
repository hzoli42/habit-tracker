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
import { useEffect, useRef, useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import { useAtom } from "jotai"
import { Label, labelsAtom } from "@/atoms/jotai"
import ColorPicker from "./ColorPicker"
import AddIcon from '@mui/icons-material/Add'
import { postLabelNew } from "@/lib/api_utils"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from "@mui/material"
import LabelIcon from '@mui/icons-material/Label';

function LabelTag({ name, color }: { name: string, color: string }) {
    return (
        <div style={{ backgroundColor: "rgba(167, 172, 177, 0.07)" }} className="flex justify-start gap-2 min-h-[20px] rounded-3xl px-3 py-1 inline">
            <LabelIcon style={{ color: color }} />
            <p>{name}</p>
        </div>
    )
}

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
    const [newLabelColor, setNewLabelColor] = useState("#ef476f")
    const [currentLabelId, setCurrentLabelId] = useState(selectedLabel?.id)
    const previousValues = useRef({ labels, currentLabelId })

    useEffect(() => {
        const oldLabels = previousValues.current.labels.sort((a, b) => a.id.localeCompare(b.id))
        const newLabels = labels.sort((a, b) => a.id.localeCompare(b.id))
        let labelsChanged = false || oldLabels.length != newLabels.length
        oldLabels.forEach((l, i) => {
            if (l.id != newLabels[i].id) {
                labelsChanged = true
            }
        })

        if (labelsChanged && previousValues.current.currentLabelId !== currentLabelId) {
            const newSelectedLabel = labels.find(ld => ld.id === currentLabelId) ?? undefined
            console.log(labels)
            console.log(currentLabelId)
            onLabelChange ? onLabelChange(newSelectedLabel) : null

            previousValues.current = { labels, currentLabelId }
        }
    })

    function onSelectLabel(currentValue: string | undefined) {
        setOpen(false)
        if (currentValue === undefined) {
            onLabelChange ? onLabelChange(currentValue) : null
            return
        }
        setCurrentLabelId(currentValue)

        const newSelectedLabel = labels.find(ld => ld.id === currentValue) ?? undefined
        onLabelChange ? onLabelChange(newSelectedLabel) : null
    }

    async function addNewLabel() {
        setOpen(false)
        const newLabelId = await postLabelNew(user?.sub, labelSearchInput, newLabelColor)
            .then(response => response.json())
            .then((data: Label) => data.id)
        setCurrentLabelId(newLabelId)
        setLabels(user?.sub ?? undefined)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={disabled}>
                <div className=" flex justify-start min-w-[130px]">
                    {
                        selectedLabel !== undefined
                            ?
                            <LabelTag name={selectedLabel.name} color={selectedLabel.color} />
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
                                <LabelTag name={labelSearchInput} color={newLabelColor} />
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

                                        <LabelTag name={label.name} color={label.color} />
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
