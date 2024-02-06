import { Dispatch, SetStateAction } from "react";
import { Button } from '@mui/material';
import { LabelCombobox } from "../utils/LabelCombobox";
import { Input } from "../ui/input";


export type StopwatchButtonProps = {
    isRunning: boolean
    setIsRunning: Dispatch<SetStateAction<boolean>>
    onTitleChange: (title: string) => void
    onLabelChange: (label: string) => void
}

export default function StopwatchInputs({ isRunning, setIsRunning, onTitleChange, onLabelChange }: StopwatchButtonProps) {
    return (
        <div className="grid grid-cols-1 content-center gap-4">
            <Input placeholder="Title" onChange={e => onTitleChange(e.target.value)} disabled={isRunning} />
            <LabelCombobox onLabelChange={(selectedLabel) => onLabelChange(selectedLabel)} disabled={isRunning} />
            {
                !isRunning
                    ? <Button className="bg-green-400" variant="contained" onClick={() => setIsRunning(true)} fullWidth>Start</Button>
                    : <Button className="bg-red-400" variant="contained" onClick={() => setIsRunning(false)} fullWidth>Stop</Button>
            }
        </div>
    );
};