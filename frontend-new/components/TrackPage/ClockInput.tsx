export function ClockInput() {
    const digitsTextClassNames = "text-clock-n-xs sm:text-clock-n-sm md:text-clock-n-md lg:text-clock-n-lg"
    const lettersTextClassNames = "text-clock-l-xs sm:text-clock-l-sm md:text-clock-l-md lg:text-clock-l-lg"
    const inputHeightClassNames = "h-clock-xs sm:h-clock-sm md:h-clock-md lg:h-clock-lg"
    const inputWidthClassNames = "w-clock-xs sm:w-clock-sm md:w-clock-md lg:w-clock-lg"

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        switch (e.currentTarget.name) {
            case "hoursInput": {
                // setTime({ hours: parseInt(e.currentTarget.value), minutes: time.minutes, seconds: time.seconds });
                break;
            }
            case "minutesInput": {
                // setTime({ hours: time.hours, minutes: parseInt(e.currentTarget.value), seconds: time.seconds });
                break;
            }
            case "secondsInput": {
                // setTime({ hours: time.hours, minutes: time.minutes, seconds: parseInt(e.currentTarget.value) });
                break;
            }
        }
    }

    return (
        <div className="flex justify-center items-end px-8 gap-1 pt-4 pb-8">
            <input name="hoursInput" onChange={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>h</p>
            <input name="minutesInput" onChange={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>m</p>
            <input name="secondsInput" onChange={handleInputChange}
                className={`${digitsTextClassNames} ${inputWidthClassNames} ${inputHeightClassNames} border-none placeholder-gray-500 placeholder:text-center`}
                type="text" maxLength={2} pattern="[0-9]*" placeholder="00" />
            <p className={`${lettersTextClassNames} pr-4 md:pr-8`}>s</p>
        </div>
    )
}