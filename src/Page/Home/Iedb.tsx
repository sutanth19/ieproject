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

// Define the IEDB data item interface
interface IedbDataItem {
    title: string;
    number: string | number;
    percentageChanged?: string;
    dateUpdated?: string;
}

// Define the color type
type ColorType = "success" | "error" | "info" | "";

function setColor(item: string | undefined): ColorType {
    if (!item) return "";
    const colorMap: Record<string, ColorType> = {
        "+": "success",
        "-": "error",
        "~": "info"
    };
    return colorMap[item[0]] || "";
}

const Iedb: React.FC = () => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [iedbData, setIedbData] = useState<IedbDataItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    useEffect(() => {
        const fetchIedbData = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await reportAPI.getIedbData();
                
                if (response.data) {
                    setIedbData(response.data);
                
                    const apiDate: string | undefined = response.data[0]?.dateUpdated;
                    
                    setLastUpdated(apiDate || new Date().toLocaleString());
                    console.log('Using API date:', apiDate);
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
                            {iedbData.map((item: IedbDataItem, index: number) => (
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
                    <Stack spacing={5} direction="column" sx={{ height: '100%' }}>
                        <Typography variant="h3" className="section-title">
                            IEDB 3.0
                        </Typography>
                        <Typography variant="h5" className="section-description">
                            Industrial Engineering Database 3.0 is the one true source for all cycle time data from end-to-end process.
                        </Typography>
                        <Typography variant="subtitle1">
                            Explore more cycle time's data collected by using tools below
                        </Typography>
                        
                        {/* Main content area with flex layout */}
                        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={2}>
                               <Button
                                size="large"
                                variant="contained"
                                onClick={() => window.open('https://iedb3-prd.jblapps.com/home', '_blank')}
                            >
                                IEDB
                            </Button>

                            <Button
                                size="large"
                                variant="contained"
                                onClick={() => window.open('http://mypenm0iesvr01/ietools/dashboard', '_blank')}
                            >
                                IE Tools
                            </Button>
                            </Stack>
                            
                            <Box sx={{ display: { xs: "none", sm: "block" }, alignSelf: 'flex-end' }}>
                                <Typography variant="caption">
                                    {lastUpdated || 'Loading...'}
                                </Typography>
                            </Box>
                        </Box>
                        

                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Iedb;