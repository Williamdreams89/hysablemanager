import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { Box } from '@mui/material';

export default function CardAlert() {
  return (
    <Card variant="outlined" sx={{ m: 1.5, p: 1.5 }}>
      <CardContent>
        <Box sx={{display:'flex', gap:'10px'}}>
        <AutoAwesomeRoundedIcon fontSize="small" />
        <Typography sx={{ fontWeight: 600 }}>
          Usage Plan
        </Typography>

        </Box>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Plan renews every 2 years. One time premium & Free 1 year maintenance
        </Typography>
        <Button variant="contained" size="small" fullWidth>
          Let's talk now!
        </Button>
      </CardContent>
    </Card>
  );
}
