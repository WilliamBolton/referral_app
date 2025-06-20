import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate } from "react-router";

function Register(props) {
    // Form for users to register
    const BASE_URL = 'http://127.0.0.1:8000/';
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        "email": "",
        "first_name": "",
        "last_name": "",
        "medical_specialty": "",
        "password": "",
    });

    const handleFormSubmit = () => {
        // Sends a POST request to the backend API to register the user
        fetch(`${BASE_URL}register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Register data', data);
            // Redirect to login page
            navigate('/');
        })
        .catch(error => {
            console.log(error); 
        });
    };

    return (
        <>
            <div className='container text-center'>
                <br />
                <h1>Please sign up below</h1>
                <br />
                <div className='mt-3'>
                    <TextField id="email" name="email" type='email' label="Email" variant="outlined" required onChange={e => setFormData({...formData, email: e.target.value})}/>
                </div>
                <br />
                <br />
                <div className='mt-3'>
                    <TextField id="first_name" name="first_name" type='text' label="First name" variant="outlined" required onChange={e => setFormData({...formData, first_name: e.target.value})}/>
                </div>
                <br />
                <br />
                <div className='mt-3'>
                    <TextField id="last_name" name="last_name" type='text' label="Last name" variant="outlined" required onChange={e => setFormData({...formData, last_name: e.target.value})}/>
                </div>
                <br />
                <br />
                <div className='mt-3'>
                    <TextField id="medical_specialty" name="medical_specialty" type='text' label="Medical specialty" variant="outlined" required onChange={e => setFormData({...formData, medical_specialty: e.target.value})}/>
                </div>
                <br/>
                <br/>
                <div className='mt-3'>
                    <TextField id="password" name="password" type='password' label="Password" variant="outlined" required onChange={e => setFormData({...formData, password: e.target.value})}/>
                </div>
                <br />
                <br />
                <div className='mt-3'>
                    <button onClick={handleFormSubmit} style={{ backgroundColor: '#282c34', border: 'none', borderRadius: '5px', color: '#ffffff', padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}>Register</button>
                </div>
                <br />
            </div>
        </>
    );
}

export default Register;
