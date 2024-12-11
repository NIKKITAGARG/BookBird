import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import FeedbackIcon from '@mui/icons-material/Feedback';

export default function Profileheader({ enableEditing, navigateBackHandler }) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={(event) => {
                            navigateBackHandler()
                        }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Profile
                    </Typography>
                    <IconButton
                        size="large"
                        edge="start"
                        color='inherit'
                        sx={{ mr: 2 }}
                        onClick={(event) => {
                            enableEditing()
                        }}
                    >
                        <EditIcon />
                    </IconButton>

                    <IconButton
                        size="large"
                        edge="start"
                        color='inherit'
                        sx={{ mr: 1 }}
                    >
                        <FeedbackIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}