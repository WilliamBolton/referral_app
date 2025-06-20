import React, { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, Grid } from '@mui/material';

const ReferralForm = ({ patients, clinicians, handleFormSubmit, handleFormChange, newReferral}) => {
  // Form for creating new referrals
  return (
    <div className='referral-input'>
      <form onSubmit={handleFormSubmit}>
        <h3>New Referral</h3>
        <br>
        </br>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="patient-label">Patient</InputLabel>
              <Select
                labelId="patient-label"
                id="patient"
                name="patient"
                value={newReferral.patient || ''}
                onChange={handleFormChange}
                required
              >
                {patients.map((patient) => (
                <MenuItem key={patient.hospital_number} value={patient.hospital_number}>
                  {`${patient.name} - ${patient.date_of_birth} - ${patient.hospital_number}`}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              id="reason"
              name="reason"
              label="Reason"
              value={newReferral.reason}
              onChange={handleFormChange}
            />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="clinician-label">Clinician</InputLabel>
              <Select
                labelId="clinician-label"
                id="clinician"
                name="clinician"
                value={newReferral.clinician|| ''}
                onChange={handleFormChange}
                required
              >
                {clinicians.map((clinician) => (
                <MenuItem key={clinician.email} value={clinician.email}>
                  {`${clinician.first_name} ${clinician.last_name} - ${clinician.medical_specialty} - ${clinician.email}`}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={1}>
            <button onClick={handleFormSubmit}>
              Refer
            </button>
          </Grid>
        </Grid>
        <br>
        </br>
      </form>
    </div>
  );
};

export default ReferralForm;
