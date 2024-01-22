import { Dispatch, SetStateAction } from "react";
import { Button } from '@mui/material';
import { LabelCombobox } from "../utils/LabelCombobox";
import { Input } from "../ui/input";


export type StopwatchButtonProps = {
    isRunning: boolean
    setIsRunning: Dispatch<SetStateAction<boolean>>
    onTitleChange: (title: string) => void
    onLabelsChange: (labels: string[]) => void
}

export default function StopwatchInputs({ isRunning, setIsRunning, onTitleChange, onLabelsChange }: StopwatchButtonProps) {
    return (
        <div className="grid grid-cols-1 content-center gap-4">
            <Input placeholder="Title" onChange={e => onTitleChange(e.target.value)} disabled={isRunning} />
            <LabelCombobox onLabelsChange={(selectedLabels) => onLabelsChange(selectedLabels)} disabled={isRunning} />
            {
                !isRunning
                    ? <Button className="bg-green-400" variant="contained" onClick={() => setIsRunning(true)} fullWidth>Start</Button>
                    : <Button className="bg-red-400" variant="contained" onClick={() => setIsRunning(false)} fullWidth>Stop</Button>
            }
        </div>
    );
};