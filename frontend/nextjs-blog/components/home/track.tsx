import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Container, Paper, Tab, TextField, Typography } from "@mui/material";
import React from "react";
import Stopwatch from "./stopwatch";
import Dashboard from "./dashboard";

export default function TrackPage() {
    const tabValues = ['live-session', 'history']
    const [tabValue, setTabValue] = React.useState(tabValues[0]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => { 
        setTabValue(newValue);
    };
    
    return (
        <Container maxWidth="md">
            <Paper variant="outlined" elevation={1} sx={{mt: '10px', height: '300px'}}>
                <Typography>Hello World</Typography>
            </Paper>
            <Box>
                <TextField label="Session Title" variant="standard" />
                <TabContext value={tabValue}>
                    <Box className="border-b-1">
                        <TabList indicatorColor="secondary" onChange={handleChange} variant="fullWidth">                                                                 ">
                            <Tab label="Live Session" value="live-session"/>
                            <Tab label="History" value="history"/>
                        </TabList>
                    </Box>
                    <TabPanel value="live-session">
                        <Stopwatch />
                    </TabPanel>
                    <TabPanel value="history">
                        <Dashboard />
                    </TabPanel>
                </TabContext>
            </Box>
        </Container>
    )
}