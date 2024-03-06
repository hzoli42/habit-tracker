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
import { useState } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"
import ColorPicker from "./ColorPicker"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import CloseIcon from '@mui/icons-material/Close'
import { IconButton } from "@mui/material"
import LabelIcon from '@mui/icons-material/Label'
import { Label, postLabelNew } from "@/lib/api_utils/label"

type PropsLabelTag = {
    name: string
    color: string
}

function LabelTag({ name, color }: PropsLabelTag) {
    return (
        <div className="flex justify-start gap-2 min-h-[20px] px-3 py-1 inline">
            <LabelIcon style={{ color: color }} />
            <p>{name}</p>
        </div>
    )
}

type Props = {
    value: Label | undefined
    labels: Label[]
    onChange?: (value: Label | undefined) => void
    onNewLabel?: (value: Label) => void
    disabled: boolean
}

function LabelCombobox({ value, labels, onChange, onNewLabel, disabled }: Props) {
    const { user } = useUser();
    const [open, setOpen] = useState(false)
    const [labelSearchInput, setLabelSearchInput] = useState("")
    const [newLabelColor, setNewLabelColor] = useState("#ef476f")

    function handleSelectLabel(currentValue: string | undefined) {
        setOpen(false)
        const newSelectedLabel = labels?.find(ld => ld.label_id === currentValue) ?? undefined
        onChange ? onChange(newSelectedLabel) : null
    }

    async function handleClickNewLabel() {
        setOpen(false)
        const newLabel = await postLabelNew(user?.sub, labelSearchInput, newLabelColor)
            .then(response => response.json())
            .then((data: Label) => data)
        console.log(newLabel)
        onNewLabel ? onNewLabel(newLabel) : null
    }

    function handleChangeColorPicker(color: string) {
        setNewLabelColor(color)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger disabled={disabled}>
                <div className="flex justify-start min-w-[130px]">
                    {
                        value !== undefined
                            ?
                            <div className="bg-[#F7F9FB] rounded-3xl">
                                <LabelTag name={value.name} color={value.color} />
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
                                onClick={handleClickNewLabel}
                                className="gap-x-2 w-full h-auto justify-start"
                            >
                                + add
                                <LabelTag name={labelSearchInput} color={newLabelColor} />
                            </Button>
                            <ColorPicker color={newLabelColor} onChange={handleChangeColorPicker} />
                        </div>
                    </CommandEmpty>
                    <CommandGroup>
                        {
                            labels?.map(label => (
                                <div className="flex justify-between items-center">
                                    <CommandItem
                                        key={label.label_id}
                                        value={label.label_id}
                                        onSelect={handleSelectLabel}
                                        className="flex justify-start items-center w-full cursor-pointer"
                                    >
                                        {(value?.label_id ?? "") === label.label_id &&
                                            <Check className={cn("mr-2 h-4 w-4")} />
                                        }
                                        <LabelTag name={label.name} color={label.color} />
                                    </CommandItem>
                                    <div>
                                        {(value?.label_id ?? "") === label.label_id &&
                                            <IconButton style={{ borderRadius: 0, backgroundColor: "transparent" }} onClick={() => handleSelectLabel(undefined)}>
                                                <CloseIcon className={cn("h-4 w-4")} />
                                            </IconButton>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default LabelCombobox