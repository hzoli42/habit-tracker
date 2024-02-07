import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";

export const TitleTextField = styled(TextField)({
    '& .MuiInput-underline:after': {
        borderBottomColor: '#9E9E9E',
    },
});
