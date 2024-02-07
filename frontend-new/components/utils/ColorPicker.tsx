import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Popover, PopoverTrigger } from "../ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { ColorResult, SketchPicker, SliderPicker, TwitterPicker } from 'react-color';

export default function ColorPicker({ initialColor, onColorChange }: {
    initialColor: string,
    onColorChange: (color: string) => void
}) {
    const [color, setColor] = useState(initialColor)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setColor(initialColor)
    }, [initialColor])

    function handleChange(color: ColorResult, event: React.ChangeEvent<HTMLInputElement>) {
        setColor(color.hex)
        onColorChange(color.hex)
    }

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" className="gap-x-1">
                        <div style={{ backgroundColor: `${color}` }} className="w-[25px] h-[20px] rounded-lg"></div>
                        <ArrowDropDownIcon className="fill-black" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="z-10">
                    {/* <SketchPicker disableAlpha={true} color={color} onChange={handleChange} /> */}
                    <TwitterPicker color={color} colors={[
                        '#F5F3E7', '#F7F6CF', '#F5E2E4',
                        '#EEBAB2', '#DEC4D6', '#E5DBD9',
                        '#DDF2F4', '#E4CEE0', '#A9C8C0', '#C2D9E1']}
                        onChange={handleChange} triangle="hide" />
                </PopoverContent>
            </Popover>
        </div>
    )
}