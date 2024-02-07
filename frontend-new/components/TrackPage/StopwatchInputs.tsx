import { Dispatch, SetStateAction, useState } from "react";
import { Button, TextField, styled } from '@mui/material';
import { LabelCombobox } from "../utils/LabelCombobox";
import { Input } from "@material-tailwind/react";
import { TitleTextField } from "../utils/TitleTextField";


export type StopwatchButtonProps = {
    isRunning: boolean
    setIsRunning: Dispatch<SetStateAction<boolean>>
    onTitleChange: (title: string) => void
    onLabelChange: (label: string) => void
}

export default function StopwatchInputs({ isRunning, setIsRunning, onTitleChange, onLabelChange }: StopwatchButtonProps) {
    return (
        <div className="grid grid-cols-1 content-center gap-4">
            {/* <Input variant="standard" label="Title" placeholder="Title" labelProps={{ className: "text-[16px]" }} onChange={e => onTitleChange(e.target.value)} disabled={isRunning} /> */}
            <TitleTextField variant="standard" hiddenLabel placeholder="Title"
                onChange={e => onTitleChange(e.target.value)} disabled={isRunning} />
            <LabelCombobox onLabelChange={(selectedLabel) => onLabelChange(selectedLabel)} disabled={isRunning} />
            {
                !isRunning
                    ? <Button className="bg-green-400 mt-2" variant="contained" onClick={() => setIsRunning(true)} fullWidth>Start</Button>
                    : <Button className="bg-red-400 mt-2" variant="contained" onClick={() => setIsRunning(false)} fullWidth>Stop</Button>
            }
        </div>
    );
};