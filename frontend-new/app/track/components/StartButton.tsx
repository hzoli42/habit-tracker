import { Button } from "@/components/ui/button"

type Props = {
    disabled: boolean
    onClick: () => void
}

function StartButton({ disabled, onClick }: Props) {

    function handleClick() {
        onClick()
    }

    return (
        <Button className="bg-green-400 mt-2" disabled={disabled} onClick={handleClick}>Start</Button>
    )
}

export default StartButton