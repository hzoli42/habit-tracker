import { StopwatchTime } from "@/app/track/page"
import { useViewport } from "@/lib/hooks"

type Props = {
    time: StopwatchTime
    color: "active" | "inactive"
}

function Clock({ time, color }: Props) {
    const digitsTextClassNames = "text-clock-n-xs sm:text-clock-n-sm md:text-clock-n-md lg:text-clock-n-lg"
    const lettersTextClassNames = "text-clock-l-xs sm:text-clock-l-sm md:text-clock-l-md lg:text-clock-l-lg pr-4 md:pr-8 py-4"
    const colorConfig = new Map<"active" | "inactive", string>([
        ["active", "text-black-600"],
        ["inactive", "text-gray-500"]
    ])

    function colouredDigits(digits: number) {
        const firstDigit = Math.floor(digits / 10)
        const secondDigit = digits % 10

        return (
            <>
                <p className={`${digitsTextClassNames} ${colorConfig.get(color)} px-1`}>{firstDigit}</p>
                <p className={`${digitsTextClassNames} ${colorConfig.get(color)}`}>{secondDigit}</p>
            </>
        )
    }

    return (
        <div className="flex justify-center items-end mx-8 pb-4">
            {colouredDigits(time.hours)} <p className={`${lettersTextClassNames}`}>h</p>
            {colouredDigits(time.minutes)} <p className={`${lettersTextClassNames}`}>m</p>
            {colouredDigits(time.seconds)} <p className={`${lettersTextClassNames}`}>s</p>
        </div>
    )
}

export default Clock