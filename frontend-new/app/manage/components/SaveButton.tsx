import { Button } from "../../../components/ui/button";
import SaveIcon from '@mui/icons-material/Save';


export function SaveButton({ onClick }: { onClick: () => void }) {
    return (
        <Button className="bg-amber-500 hover:bg-amber-600" onClick={onClick}>
            <div className="flex justify-center gap-1">
                <SaveIcon /> save
            </div>
        </Button>
    )
}