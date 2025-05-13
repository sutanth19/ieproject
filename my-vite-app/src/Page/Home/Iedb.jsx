import React, { useState, useEffect } from "react";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { useTheme } from "./../../themes/ThemeContext";
import { useNavigate } from "react-router-dom";
import { reportAPI } from "../../services/reportAPI";
import '../Css/Global.css';

function setColor(item) {
    if (!item) return "";
    const colorMap = {
        "+": "success",
        "-": "error",
        "~": "info"
    };
    return colorMap[item[0]] || "";
}

const Iedb = () => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [iedbData, setIedbData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);


    useEffect(() => {
        const fetchIedbData = async () => {
            try {
                setLoading(true);
                const response = await reportAPI.getIedbData();
                
                if (response.data) {
                    setIedbData(response.data);
                    setLastUpdated(new Date().toLocaleString());
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching IEDB data:', err);
                setError('Failed to load IEDB data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchIedbData();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <Grid container spacing={3}>
                <Grid size={{ sm: 12, md: 4 }}>
                    <Stack>
                        <Card elevation={0} sx={{
                            borderRadius: '5px',
                            padding: "30px",
                            borderLeft: "4px solid #46BFE8"
                        }}>
                            {iedbData.map((item, index) => (
                                <div key={index}>
                                    <Stack direction="row" justifyContent={{ justifyContent: "space-between" }} alignItems={{ alignItems: "center" }}>
                                        <Stack justifyContent={{ justifyContent: `${item.percentageChanged}` ? `space-between` : `flex-start`}}>
                                            <Typography variant="subtitle1" fontWeight={500}>
                                                {item.title}
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{ paddingLeft: "10px" }} fontWeight={500} color={setColor(item.percentageChanged)}>
                                                {item.percentageChanged}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h3">
                                            {item.number}
                                        </Typography>
                                    </Stack>
                                    <Divider variant="middle" sx={{ marginY: "8px" }} />
                                </div>
                            ))}
                        </Card>
                    </Stack>
                </Grid>
                <Grid size={{ sm: 12, md: 8 }}>
                    <Stack spacing={5} direction="column">
                        <Typography variant="h3" className="section-title">
                            IEDB 3.0
                        </Typography>
                        <Typography variant="h5" className="section-description">
                            Industrial Engineering Database 3.0 is the one true source for all cycle time data from end-to-end process.
                        </Typography>
                        <Typography variant="subtitle1">
                            Explore more cycle time's data collected by using tools below
                        </Typography>
                        <Stack direction="row" justifyContent={{ justifyContent: "space-between" }} alignItems={{ alignItems: "flex-end" }}>
                            <Stack direction="row" spacing={2}>
                                <Button size="large" variant="contained" fullWidth="false">IEDB</Button>
                                <Button size="large" variant="contained" fullWidth="false">IE Tools</Button>
                            </Stack>
                            <Typography sx={{display: {xs : "none"}}} variant="caption">
                                Last updated: {lastUpdated || 'Loading...'}
                            </Typography>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Iedb;