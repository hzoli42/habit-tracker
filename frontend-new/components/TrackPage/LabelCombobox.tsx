"use client"

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
import { useEffect } from "react"
import { useUser } from "@auth0/nextjs-auth0/client"

// const frameworks = [
//   {
//     value: "next.js",
//     label: "Next.js",
//   },
//   {
//     value: "sveltekit",
//     label: "SvelteKit",
//   },
//   {
//     value: "nuxt.js",
//     label: "Nuxt.js",
//   },
//   {
//     value: "remix",
//     label: "Remix",
//   },
//   {
//     value: "astro",
//     label: "Astro",
//   },
// ]

// const labels = ["maths", "biology", "physics", "history"]

export function LabelCombobox() {
    const [open, setOpen] = React.useState(false)
    const [labels, setLabels] = React.useState<string[]>([])
    const [values, setValues] = React.useState<string[]>([])
    const [labelsUpToDate, setLabelsUpToDate] = React.useState(false)
    const { user, error, isLoading } = useUser();

    useEffect(() => {
        if (isLoading) {
            return
        }
        console.log(user)
        if (!labelsUpToDate) {
            fetch(`http://0.0.0.0:5000/user/${user?.sub}/labels`, {
                method: "GET",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
            })
                .then(response => response.json())
                .then(data => {
                    console.log(`Id = ${data.id}, Labels = ${data.labels}`)
                    setLabels(data.labels)
                })
            setLabelsUpToDate(true)
        }
    }, [labelsUpToDate, isLoading])


    function handleDelete(currentValue: string) {
        console.info("You clicked the delete button on a Chip component")
        setValues(values.filter(v => v != currentValue))
    }

    function onSelectLabel(currentValue: string) {
        let newValues: string[] = []
        !values.includes(currentValue)
            ? newValues = values.concat([currentValue])
            : newValues = values.filter(v => v != currentValue)
        setValues(newValues)
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
                        values.length != 0
                            ? values.map(value => <Chip label={value} onDelete={() => handleDelete(value)} />)
                            : "Select labels..."
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Select labels..." />
                    <CommandEmpty>No label found</CommandEmpty>
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
                                            values.includes(label) ? "opacity-100" : "opacity-0"
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
