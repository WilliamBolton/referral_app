import React, { useState, useEffect } from 'react';
import backgroundImage from './novableep_logo.jpeg';
import { jwtDecode } from 'jwt-decode'
import { Card, CardContent, Typography } from '@mui/material';

const HomeArea = () => {
  // Home page of the app
  const currentUser = {
    token: getAuthTokenFromCookie(),
    email: jwtDecode(getAuthTokenFromCookie()).email, // Decode email from the token  
  };
  const [incompleteReferralsCount, setIncompleteReferralsCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserFirstName, setCurrentUserFirstName] = useState(null);
  const [currentUserLastName, setCurrentUserLastName] = useState(null);
  const [currentUserMedicalSpecialty, setCurrentUserMedicalSpecialty] = useState(null);

  useEffect(() => {
    const fetchIncompleteReferralsCount = async () => {
      // Fetches the number of incomplete referrals from the backend API.
      try {
        const response = await fetch('http://127.0.0.1:8000/api/referrals/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({
            user: currentUser.email,
          })
        });
        if (!response.ok) {
          throw new Error('Failed to fetch referrals');
        }
        const referral_data = await response.json();
        const incompleteReferrals = referral_data.filter(referral => referral.status === 'incomplete'); // Filter for incomplete referrals
        const count = incompleteReferrals.length; // Count the number of incomplete referrals
        setIncompleteReferralsCount(count);
      } catch (error) {
        console.error('Error fetching incomplete referrals count:', error);
      }
    
      // Fetch the ID of the logged-in user
      fetch(`http://127.0.0.1:8000/api/specific_user/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
            user: currentUser.email
        })
    })
    .then(res => res.json())
    .then(user_data => {
        setCurrentUserId(user_data.id);
        setCurrentUserFirstName(user_data.first_name)
        setCurrentUserLastName(user_data.last_name)
        setCurrentUserMedicalSpecialty(user_data.medical_specialty)
    });
    };

    fetchIncompleteReferralsCount(); // Fetch incomplete referrals count when the component mounts
  }, []); // Empty dependency array to ensure the effect runs only once

  function getAuthTokenFromCookie() {
    // Gets token from the cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === "token") {
            return value;
        }
      }
      return null;
  }

  return (
    <div className='home-area' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#052149', height: '100vh' }}>
      <h1>Welcome {currentUserFirstName} to Novableep!</h1>
      <img src={backgroundImage} alt="Background" style={{ width: '15%', maxWidth: '600px' }} />
      <br>
      </br>
      <br>
      </br>
      <Card style={{ marginTop: '20px', width: '300px', backgroundColor: '#b3e2e4' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom style={{ color: '#052149' }}>
            Incomplete Referrals
          </Typography>
          <Typography variant="h4" style={{ color: `${incompleteReferralsCount === 0 ? '#052149' : 'red'}`, fontWeight: 'bold' }}>
            {incompleteReferralsCount}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomeArea;
