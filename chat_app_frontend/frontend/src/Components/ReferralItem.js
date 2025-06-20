import React from 'react';
import { Card, CardContent, Typography, Grid, Button, Box } from '@mui/material';

export default function ReferralItem({ referralId, patientName, dateOfBirth, hospitalNumber, reason, sender, timestamp, status, handleMarkCompleted }) {
  // A single referral
  const getStatusColor = () => {
    // Determines the background color of the referral card based on its status
    return status === 'completed' ? '#C8E6C9' : '#E0E0E0';
  };

  const hoursSinceReceived = () => {
    // Calculates the number of hours since the referral was received
    const receivedTime = new Date(timestamp);
    const currentTime = new Date();
    const differenceInHours = Math.round((currentTime - receivedTime) / (1000 * 60 * 60));
    return differenceInHours;
  };

  return (
    <Card sx={{ bgcolor: getStatusColor(), borderRadius: 4, margin: '10px' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom align="center">
          {patientName}
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" gutterBottom>
              Date of Birth: {dateOfBirth}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'center' }}>
            <Typography variant="body2" gutterBottom>
              Hospital Number: {hospitalNumber}
            </Typography>
          </Grid>
        </Grid>
        <Box bgcolor="#FFFFFF" p={2} borderRadius={4} my={2}>
          <Typography variant="body1" gutterBottom>
            {reason}
          </Typography>
        </Box>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              Sent by: {sender}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body2" color="textSecondary">
              {hoursSinceReceived()} hours ago
            </Typography>
          </Grid>
        </Grid>
        {status === 'incomplete' && ( // Render button if status is incomplete
          <Grid container justifyContent="center">
            <button
              onClick={() => handleMarkCompleted(referralId)}
              style={{ backgroundColor: '#282c34', border: 'none', borderRadius: '5px', color: '#ffffff', padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}
            >
              Complete
            </button>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
};
