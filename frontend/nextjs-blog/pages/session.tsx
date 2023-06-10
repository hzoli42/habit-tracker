import Link from "next/link";
import styles from '../styles/Session.module.css';
import Stopwatch from "../components/stopwatch";
import { Container, Grid, Typography } from "@mui/material";

export default function Session() {
    return (
        <Container maxWidth="sm">
            <Stopwatch />
            <Typography> <Link href="/">Back to landing page</Link> </Typography>
        </Container>
    )
}