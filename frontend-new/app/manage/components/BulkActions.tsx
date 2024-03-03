import { Divider } from "@mui/material"
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useState } from "react";
import { Label } from "@/lib/jotai";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { LabelCombobox } from "../../../components/utils/LabelCombobox";

export type BulkActionsProps = {
    numSelected: number
    onBulkDelete: () => void
    onBulkLabelChange: (selectedLabel: Label | undefined) => void
}

export function BulkActions({ numSelected, onBulkDelete, onBulkLabelChange }: BulkActionsProps) {
    const [currentLabel, setCurrentLabel] = useState<Label | undefined>(undefined)
    const [open, setOpen] = useState(false)

    function handleLabelChange(selectedLabel: Label | undefined) {
        setCurrentLabel(selectedLabel)
        onBulkLabelChange(selectedLabel)
    }


    return (
        <div className="flex justify-start items-center border rounded-xl">
            <div className="bg-black bg-opacity-[0.07] py-2 px-3">
                {numSelected} selected
            </div>
            <Divider orientation="vertical" />
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger className="text-black text-lg">
                    <div
                        className="flex justify-center items-center gap-1 cursor-pointer py-2 px-3 hover:text-amber-600"
                    >
                        <LabelOutlinedIcon /> Labels
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <div className="p-4">
                        <LabelCombobox disabled={false} selectedLabel={currentLabel} onLabelChange={handleLabelChange} />
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <Divider orientation="vertical" />
            <div
                className="flex justify-center items-center gap-1 cursor-pointer py-2 px-3 hover:text-red-600"
                onClick={onBulkDelete}
            >
                <DeleteOutlineOutlinedIcon /> Delete
            </div>
        </div>
    )
}