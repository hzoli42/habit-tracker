import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Props = {
    open: boolean
    onClose: () => void
}

function TimerExpiredDialog({ open, onClose }: Props) {
    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Your timer has expired!</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => onClose()}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default TimerExpiredDialog