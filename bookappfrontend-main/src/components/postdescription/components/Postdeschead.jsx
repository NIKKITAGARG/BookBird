import React from 'react'
// components
import { Typography, Box } from '@mui/material'
import { useTheme } from '@emotion/react'

const Postdeschead = ({ data }) => {
    const theme=useTheme();

    return (
        <Box sx={{
            display : "flex",
            justifyContent : "space-between",
            paddingX: "0.5rem"
        }}>
            <Box>
                <Typography>{data.bookName.toUpperCase()}</Typography>
                <Typography>{data.publication.toUpperCase()} PUBLICATION</Typography>
                <Typography>{data.subject.toUpperCase()}</Typography>
            </Box>
            <Box>
                <Typography sx={{fontWeight:theme.typography.bookHeading,fontSize:theme.typography.subHeadingSize}}>
                    <span>&#8377;</span>
                    {data.sellingPrice}
                </Typography>
                {
                    data.isNegotiable ?
                        <Typography sx={{color:theme.palette.secondary.text}}>*Negotiable</Typography> : null
                }
            </Box>
            
        </Box>
    )
}

export default Postdeschead