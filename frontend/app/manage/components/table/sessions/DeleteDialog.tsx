import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete'
import { Session, deleteSessionById } from "@/lib/api_utils/session"
import { useUser } from "@auth0/nextjs-auth0/client"

type Props = {
    session: Session
    onDialogSubmit: () => void
}

function DeleteDialog({ session, onDialogSubmit }: Props) {
    const { user } = useUser()
    const [open, setOpen] = useState(false)



    function handleDialogSubmit() {
        setOpen(false)
        deleteSessionById(session.session_id, user?.sub).then(() => {
            onDialogSubmit()
        })

    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex justify-start gap-2">
                    <DeleteIcon className="text-red-600 fill-red-600" /> delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center">Are you sure you want to delete this session?</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center gap-12 pt-6">
                    <Button onClick={handleDialogSubmit}>Yes</Button>
                    <Button onClick={() => setOpen(false)}>No</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDialog