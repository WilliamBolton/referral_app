import React, { useState, useEffect, useRef } from 'react';
import ReferralForm from './ReferralForm';
import ReferralItem from './ReferralItem'; // Create this component to render individual referral items
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export default function Referral() {
    // The referral interface where users can interact with their referrals and send new ones
    const BASE_URL = 'http://127.0.0.1:8000/'
    const location = useLocation();
    const [referrals, setReferrals] = useState([]);
    const currentUser = {
        token: getAuthTokenFromCookie(),
        email: jwtDecode(getAuthTokenFromCookie()).email, // Decode email from the token
    };
    const [currentUserId, setCurrentUserId] = useState(null);
    const [newReferral, setNewReferral] = useState({
        patient: null,
        reason: '',
        clinician: null,
        sender: currentUser.email
    });
    const [ws, setWs] = useState(null);
    const [patients, setPatients] = useState([]);
    const [clinicians, setClinicians] = useState([]);

    useEffect(() => {
        connectToWebSocket(); // Connect to WebSocket when component mounts
        fetchReferrals(); // Fetch referrals from backend API

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
        });

        // fetch clinicians/users
        const authToken = getAuthTokenFromCookie()
        console.log(authToken)
        if(authToken){
            axios.get(`${BASE_URL}/api/users/`, {
            headers:{
                Authorization:`Bearer ${authToken}`
            }
            }).then(response => {
                console.log("Clinicians data:", response.data);
                setClinicians(response.data)
            }).catch(error => {
                console.log("Error making API request for clinicians:", error)
            })
        };

        // fetch patients
        if(authToken){
            axios.get(`${BASE_URL}/api/patients/`, {
            headers:{
                Authorization:`Bearer ${authToken}`
            }
            }).then(response => {
                console.log("Patients data:", response.data);
                setPatients(response.data)
            }).catch(error => {
                console.log("Error making API request for patients:", error)
            })
        };
    }, []);

    const connectToWebSocket = () => {
        // Establish WebSocket connection
        const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/referral/${currentUser.email}/?token=${currentUser.token}`);
        websocket.onopen = () => {
            console.log('WebSocket connection established');
            console.log(websocket.url)
            setWs(websocket); // Set WebSocket connection in state
        };
        websocket.onmessage = (message) => {
            console.log('Received referral:', message);
            fetchReferrals(); // Fetch referrals when a new message is received
        };
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const fetchReferrals = async () => {
        // Fetches all referrals for the particular user
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
            console.log('Referral data:', referral_data);
            setReferrals(referral_data);
        } catch (error) {
            console.error('Error fetching referrals:', error);
        }
    };

    const handleMarkCompleted = async (referralId) => {
        // Marks a referral as completed by sending a request to a backend API
        console.log('referralId', referralId)
        try {
            // Send request to backend to mark referral as completed
            await fetch(`http://127.0.0.1:8000/api/mark_referral_as_completed/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({
                    referral_id: referralId,
                })
            });
            // Update view
            fetchReferrals()
        } catch (error) {
            console.error('Error marking referral as completed:', error);
        }
    };

    const handleFormChange = (event) => {
        // Updates the `newReferral` state when form inputs change
        const { name, value } = event.target;
        console.log(name, value)
        // Handle special case for Select component
        if (name === 'patient' || name === 'clinician') {
          // If the value is null, set it to an empty string
          const updatedValue = value === null ? '' : value;
      
          // Update the state
          setNewReferral(prevState => ({
            ...prevState,
            [name]: updatedValue
          }));
        } else {
          // For other input fields, update the state directly
          setNewReferral(prevState => ({
            ...prevState,
            [name]: value
          }));
        }
      };
      

    const handleFormSubmit = async (event) => {
        // Submits a new referral form by sending a request to a backend API
        event.preventDefault();
        console.log('newReferral:', newReferral)
        try {
            await axios.post('http://127.0.0.1:8000/api/create_referral/', newReferral, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                }
            });
            console.log('Referral sent')
            // Reset form fields
            setNewReferral({
                patient: '',
                reason: '',
                clinician: '',
            });
        } catch (error) {
            console.error('Error creating new referral:', error);
        }
    };
    

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

    // Find patient details by from referralID based on the patients previously loaded
    const findPatientById = (hospital_number) => {
        console.log('patientDetails', patients)
        return patients.find(patient => patient.hospital_number === hospital_number);
    };

    // Find clinician details by ID from referral based on the clinicians previously loaded
    const findClinicianById = (id) => {
        return clinicians.find(clinician => clinician.id === id);
    };

    return (
        <div className="referral-area">
            <div className="referral-columns">
                <div className="incomplete-column">
                    <div className="referral-header">Incomplete</div>
                    {referrals
                    .filter((referral) => referral.status === "incomplete")
                    .map((referral) => {
                        // Get patient details for the particular referral
                        const patientDetails = findPatientById(referral.patient_hospital_number);
                        // Get clinician details for the particular referral
                        const clinicianDetails = findClinicianById(referral.sender);
                        
                        return (
                            <ReferralItem
                                key={referral.id}
                                referralId={referral.id}
                                patientName={patientDetails.name}
                                dateOfBirth={patientDetails.date_of_birth}
                                hospitalNumber={patientDetails.hospital_number}
                                reason={referral.reason}
                                status={referral.status}
                                sender={`${clinicianDetails.first_name} ${clinicianDetails.last_name} - ${clinicianDetails.medical_specialty} - ${clinicianDetails.email}`}
                                timestamp={referral.timestamp}
                                handleMarkCompleted={handleMarkCompleted}
                            />
                        );
                    })}
                </div>
                <div className="completed-column">
                    <div className="referral-header">Completed</div>
                    {referrals
                    .filter((referral) => referral.status === "completed")
                    .map((referral) => {
                        // Get patient details for the particular referral
                        const patientDetails = findPatientById(referral.patient_hospital_number);
                        // Get clinician details for the particular referral
                        const clinicianDetails = findClinicianById(referral.sender);
                        
                        return (
                            <ReferralItem
                                key={referral.id}
                                referralId={referral.id}
                                patientName={patientDetails.name}
                                dateOfBirth={patientDetails.date_of_birth}
                                hospitalNumber={patientDetails.hospital_number}
                                reason={referral.reason}
                                status={referral.status}
                                sender={`${clinicianDetails.first_name} ${clinicianDetails.first_name} - ${clinicianDetails.medical_specialty} - ${clinicianDetails.email}`}
                                timestamp={referral.timestamp}
                            />
                        );
                    })}
                </div>
            </div>
            <ReferralForm
                patients={patients} 
                clinicians={clinicians}
                handleFormChange={handleFormChange}
                handleFormSubmit={handleFormSubmit}
                newReferral={newReferral}
            />
        </div>
    );
}
