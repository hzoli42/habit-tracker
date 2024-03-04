import { Button } from "@/components/ui/button"

type Props = {
    onClick: () => void
}

function StopButton({ onClick }: Props) {

    function handleClick() {
        onClick()
    }

    return (
        <Button className="bg-red-400 mt-2" onClick={handleClick}>Stop</Button>
    )
}

export default StopButton