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
                        '#ef476f', '#b5179e', '#d90429',
                        '#fb5607', '#fca311', '#ffd166',
                        '#00b4d8', '#023e8a', '#03045e', '#264653',
                        '#2d6a4f', '#40916c']}
                        onChange={handleChange} triangle="hide" />
                </PopoverContent>
            </Popover>
        </div>
    )
}