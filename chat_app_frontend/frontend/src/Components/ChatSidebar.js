import { LinearProgress } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home';
//import ReferralIcon from '@mui/icons-material/Assignment';
import ReferralIcon from '@mui/icons-material/PeopleAlt';
import ChatIcon from '@mui/icons-material/Chat';
import AccountIcon from '@mui/icons-material/AccountCircle'
import HelpIcon from '@mui/icons-material/HelpCenter'

import { jwtDecode } from 'jwt-decode'
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material'

export default function ChatSidebar() {
    // The sidebar menu when logged in
    const BASE_URL = 'http://127.0.0.1:8000/'
    const [userList, setuserlist] = useState([])
    const [userLoader, setuserloader] = useState(true)
    const currentUser = {
        token: getAuthTokenFromCookie(),
        email: jwtDecode(getAuthTokenFromCookie()).email, // Decode email from the token
    }
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

    useEffect(() => {
        const authToken = getAuthTokenFromCookie()
        console.log(authToken)
        if(authToken){
            axios.get(`${BASE_URL}/api/users/`, {
            headers:{
                Authorization:`Bearer ${authToken}`
            }
            }).then(response => {
                setuserlist(response.data)
                setuserloader(false)
            }).catch(error => {
                console.log("Error making API request:", error)
            })
        }
    }, []);

    return (
        <div className='chat-sidebar' >
            {userLoader ? (<Box sx={{width: '100%'}}>
                <LinearProgress/>
            </Box>):
            (
                <List sx={{width: '100%', maxwidth: 360, bgcolor: 'background.paper'}}>
                    <div className="chat-sidebar-link">
                        <HomeIcon className="chat-sidebar-icon" />
                        <a href="/home" className="chat-sidebar-text" style={{ textAlign: 'center' }}>Home</a>
                    </div>
                    <br>
                    </br>
                    <div className="chat-sidebar-link">
                        <ReferralIcon className="chat-sidebar-icon" />
                        <a href={`/referral/${currentUser.email}`} className="chat-sidebar-text">Referrals</a>
                    </div>
                    <br>
                    </br>
                    <div className="chat-sidebar-link">
                        <ChatIcon className="chat-sidebar-icon" />
                        <span className="chat-sidebar-text">Messages</span>                    
                    </div>
                    {userList.map((user, index) => (
                        <ListItem key={index} button component="a" href={`/${user.email}`} className="user-list">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <ListItemAvatar>
                                    <Avatar>
                                        <AccountIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" color="textPrimary">
                                            {`${user.first_name} ${user.last_name}`}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="textSecondary">
                                            {user.medical_specialty}
                                        </Typography>
                                    }
                                />
                            </div>
                        </ListItem>
                    ))}
                    <br>
                    </br>
                    <div className="chat-sidebar-link">
                        <HelpIcon className="chat-sidebar-icon" />
                        <a href={`/ai_chat/${currentUser.email}`} className="chat-sidebar-text">AI Assistant</a>
                    </div>
                </List>
            )}
        </div>
    );
}
