import { StopwatchTime } from "@/app/track/page";
import { useState } from "react";

export function ClockInput({ onClockInput }: { onClockInput: (clockInput: StopwatchTime) => void }) {
    const [time, setTime] = useState<StopwatchTime>({ hours: 0, minutes: 0, seconds: 0 })
    const digitsTextClassNames = "text-clock-n-xs sm:text-clock-n-sm md:text-clock-n-md lg:text-clock-n-lg"
    const lettersTextClassNames = "text-clock-l-xs sm:text-clock-l-sm md:text-clock-l-md lg:text-clock-l-lg"
    const inputHeightClassNames = "h-clock-xs sm:h-clock-sm md:h-clock-md lg:h-clock-lg"
    const inputWidthClassNames = "w-clock-xs sm:w-clock-sm md:w-clock-md lg:w-clock-lg"

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        let newTime = time
        switch (e.currentTarget.name) {
            case "hoursInput": {
                newTime.hours = parseInt(e.currentTarget.value) || 0
                break;
            }
            case "minutesInput": {
                newTime.minutes = parseInt(e.currentTarget.value) || 0
                break;
            }
            case "secondsInput": {
                newTime.seconds = parseInt(e.currentTarget.value) || 0
                break;
            }
        }
        setTime(newTime)
        onClockInput(newTime)
    }

    return (
        <div className="flex justify-center items-end px-8 gap-1 pt-4 pb-8">
            <input name="hoursInput" onInput={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>h</p>
            <input name="minutesInput" onInput={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>m</p>
            <input name="secondsInput" onInput={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" minLength={2} />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>s</p>
        </div>
    )
}