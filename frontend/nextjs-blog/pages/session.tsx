import Link from "next/link";
import styles from '../styles/Session.module.css';
import Stopwatch from "../components/stopwatch";
import { Box, Container, Grid, Typography } from "@mui/material";
import { spacing } from '@mui/system';


export default function Session() {
    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: '100px'}}>
                <Stopwatch />
            </Box>
        </Container>
    )
}