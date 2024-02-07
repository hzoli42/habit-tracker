import { Dispatch, SetStateAction, useState } from "react";
import { Button, TextField, styled } from '@mui/material';
import { LabelCombobox } from "../utils/LabelCombobox";
import { Input } from "@material-tailwind/react";


export type StopwatchButtonProps = {
    isRunning: boolean
    setIsRunning: Dispatch<SetStateAction<boolean>>
    onTitleChange: (title: string) => void
    onLabelChange: (label: string) => void
}

const NewTitleTextField = styled(TextField)({
    //    '& label.Mui-focused': {
    //         color: '#A0AAB4',
    //     }, 
    '& .MuiInput-underline:after': {
        borderBottomColor: '#9E9E9E',
    },
    // '& .MuiOutlinedInput-root': {
    //     '& fieldset': {
    //         borderColor: '#E0E3E7',
    //     },
    //     '&:hover fieldset': {
    //         borderColor: '#B2BAC2',
    //     },
    //     '&.Mui-focused fieldset': {
    //         borderColor: '#6F7E8C',
    //     },
    // },
});

export default function StopwatchInputs({ isRunning, setIsRunning, onTitleChange, onLabelChange }: StopwatchButtonProps) {
    return (
        <div className="grid grid-cols-1 content-center gap-4">
            {/* <Input variant="standard" label="Title" placeholder="Title" labelProps={{ className: "text-[16px]" }} onChange={e => onTitleChange(e.target.value)} disabled={isRunning} /> */}
            <NewTitleTextField variant="standard" hiddenLabel placeholder="Title" onChange={e => onTitleChange(e.target.value)} disabled={isRunning} id="custom-css-textfield" />
            <LabelCombobox onLabelChange={(selectedLabel) => onLabelChange(selectedLabel)} disabled={isRunning} />
            {
                !isRunning
                    ? <Button className="bg-green-400" variant="contained" onClick={() => setIsRunning(true)} fullWidth>Start</Button>
                    : <Button className="bg-red-400" variant="contained" onClick={() => setIsRunning(false)} fullWidth>Stop</Button>
            }
        </div>
    );
};