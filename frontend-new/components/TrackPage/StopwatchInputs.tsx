import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, TextField, styled } from '@mui/material';
import { LabelCombobox } from "../utils/LabelCombobox";
import { Input } from "@material-tailwind/react";
import { TitleTextField } from "../utils/TitleTextField";
import { Label } from "@/atoms/jotai";


export type StopwatchButtonProps = {
    titleValue: string
    labelValue: Label | undefined
    isRunning: boolean
    onTitleChange: (title: string) => void
    onLabelChange: (label: Label | undefined) => void
    onStartStopToggle: () => void
}

export default function StopwatchInputs({ titleValue, labelValue, isRunning, onTitleChange, onLabelChange, onStartStopToggle }: StopwatchButtonProps) {
    function handleTitleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        onTitleChange(e.target.value)
    }

    function handleLabelChange(label: Label | undefined) {
        onLabelChange(label)
    }

    function handleStartStopToggle() {
        onStartStopToggle()
    }

    return (
        <div className="grid grid-cols-1 content-center gap-4">
            <TitleTextField value={titleValue} variant="standard" hiddenLabel placeholder="Title"
                onChange={handleTitleChange} disabled={isRunning} />
            <LabelCombobox selectedLabel={labelValue} onLabelChange={handleLabelChange} disabled={isRunning} />
            {
                !isRunning
                    ? <Button className="bg-green-400 mt-2" variant="contained" onClick={onStartStopToggle} fullWidth>Start</Button>
                    : <Button className="bg-red-400 mt-2" variant="contained" onClick={onStartStopToggle} fullWidth>Stop</Button>
            }
        </div>
    );
};