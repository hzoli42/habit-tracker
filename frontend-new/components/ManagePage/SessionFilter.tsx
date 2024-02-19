import FilterListIcon from '@mui/icons-material/FilterList';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { IconButton } from '@mui/material';
import { CommandInput, CommandEmpty, CommandGroup, CommandItem } from 'cmdk';
import { Command, Check } from 'lucide-react';
import ColorPicker from '../utils/ColorPicker';
import { useState } from 'react';
import { Label } from '../ui/label';
import { DateTimeField } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';


export type DateFilterOperations = "equals" | "not equals" | "after" | "before"
export type DateFilterExpression = {
    type: "label"
    operation: DateFilterOperations
    value: string
}

export type LabelFilterOperations = "equals" | "not equals"
export type LabelFilterExpression = {
    type: "label"
    operation: LabelFilterOperations
    value: string
}

export type FilterGroup = {
    operation: "and" | "or"
    expressions: (LabelFilterExpression | DateFilterExpression)[]
}

export function SessionFilter() {
    const [open, setOpen] = useState(false)
    const [startTime, setStartTime] = useState<number | undefined>(undefined)
    const [endTime, setEndTime] = useState<number | undefined>(undefined)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger>
                <Button variant="ghost" className="flex justify-start">
                    <FilterListIcon />
                    <p>Filter </p>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto min-w-sm max-w-lg">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="stop" className="text-right">
                        Stop time:
                    </Label>
                    <div className="col-span-3">
                        <DateTimeField
                            id="stop"

                            value={dayjs.unix(endTime)}
                            onChange={(value) => setEndTime(value ? value.unix() : 0)}
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}