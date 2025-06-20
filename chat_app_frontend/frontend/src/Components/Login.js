import React, { useState } from 'react'
import {TextField, Button} from '@mui/material'

export default function Login() {
        // Form for users to login
        const BASE_URL = 'http://127.0.0.1:8000/';
        const [formData, setFormData] = useState({
            "email": "",
            "password": "",
        })
        const handleFormSubmit = () =>{
            // Sends a POST request to the backend API to authenticate the user
            fetch(`${BASE_URL}login/`,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(formData)
        })
        .then(response => response.json(
        ))
        .then(
            data => {
                console.log('Login data', data)
                const token = data.token;
                document.cookie = `token=${token}; path=/`
                // Redirect to home container view after successful login
                window.location.href = "/home";
        })
        .catch(error => {
           console.log(error); 
        })
    }
    return (
        <>
            <div className='container text-center'>
            <br/>
                <h1>Please login</h1>
                <br/>
                <br/>
                <div className='mt-3'>
                <TextField id="email" name="email" type='email' label="Email" variant="outlined" required onChange={e => setFormData({...formData, email: e.target.value})}/>
                </div>
                <br/>
                <br/>
                <div className='mt-3'>
                <TextField id="password" name="password" type='password' label="Password" variant="outlined" required onChange={e => setFormData({...formData, password: e.target.value})}/>
                </div>
                <br/>
                <br/>
                <div className='mt-3'>
                <button onClick={handleFormSubmit}
                style={{ backgroundColor: '#282c34', border: 'none', borderRadius: '5px', color: '#ffffff', padding: '10px 20px', marginTop: '10px', cursor: 'pointer' }}
                >Login</button>
                </div>
            <br/>
            </div>

        </>
    )

}