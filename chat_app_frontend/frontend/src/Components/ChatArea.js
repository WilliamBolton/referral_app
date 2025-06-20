import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import { Avatar, Typography} from '@mui/material'
import AccountIcon from '@mui/icons-material/AccountCircle'

export default function ChatArea() {
    // The chat interface where users can interact with other users
    const location = useLocation();
    const recipient_email = location.pathname.split('/').pop(); // Extract email from the URL
    const [messages, setMessages] = useState([]);
    const currentUser = {
        token: getAuthTokenFromCookie(),
        email: jwtDecode(getAuthTokenFromCookie()).email, // Decode email from the token
    };
    const [currentUserId, setCurrentUserId] = useState(null);
    const [recipientId, setRecipientId] = useState(null);
    const [recipientFirstName, setRecipientFirstName] = useState(null);
    const [recipientLastName, setRecipientLastName] = useState(null);
    const [recipientMedicalSpecialty, setRecipientMedicalSpecialty] = useState(null);
    console.log('User email:', currentUser.email);
    console.log('Recipient email:', recipient_email);
    const [ws, setWs] = useState(null);
    const messagesEndRef = useRef(null); // Create a ref for the messages container element to scroll to

    useEffect(() => {
        connectToWebSocket(); // Connect to WebSocket when component mounts
        fetchMessages(); // Fetch historical messages when component mounts

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

        // Fetch the ID of the recipient
        fetch(`http://127.0.0.1:8000/api/specific_user/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                user: recipient_email
            })
        })
        .then(res => res.json())
        .then(user_data => {
            setRecipientId(user_data.id);
            setRecipientFirstName(user_data.first_name)
            setRecipientLastName(user_data.last_name)
            setRecipientMedicalSpecialty(user_data.medical_specialty)
        });

    }, []);

    const connectToWebSocket = () => {
        // Establish WebSocket connection
        const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/${recipient_email}/?token=${currentUser.token}`);
        websocket.onopen = () => {
            console.log('WebSocket connection established');
            console.log(websocket.url)
            setWs(websocket); // Set WebSocket connection in state
        };
        websocket.onmessage = (message) => {
            console.log('Received message:', message);
            fetchMessages(); // Fetch messages when a new message is received
        };
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    
    messagesEndRef.current.scrollIntoView({ });
    };

    const fetchMessages = () => {
        // Fetches all messages for the particular user and recipient
        fetch('http://127.0.0.1:8000/api/messages/', {
            method: 'POST', // Use POST method as GET did not work?
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                sender: currentUser.email,
                recipient: recipient_email
            })
        })
        .then(res => res.json())
        .then(message_data => {
            console.log('Message data:', message_data);
            setMessages(message_data);
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the bottom after fetching messages
        })
        .catch(error => {
            console.error('Error fetching message data:', error);
        });
    };

    console.log('currentUserId', currentUserId)
    console.log('recipientId', recipientId)
    console.log('recipientMedicalSpecialty', recipientMedicalSpecialty)
    
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

    const handleSendMessage = () => {
        // Sends a message via the WebSocket connection
        if (ws.readyState === ws.OPEN) {
            console.log('Sending message ...')
            ws.send(JSON.stringify({ 
                message: inputValue,
                recipient_email: recipient_email,
            }));
            setInputValue('');
            fetchMessages();
        }
    };

    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    return (
        <div className='chat-area'>
            <div className='chat-header'>
            <div className='recipient-info' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar>
                <AccountIcon fontSize="large"/>
                </Avatar>
                <div style={{ marginLeft: '20px' }}>
                <Typography variant="body1" color="textPrimary" sx={{ fontSize: '1.8rem' }}>
                    {recipientFirstName} {recipientLastName}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1.4rem' }}>
                    {recipientMedicalSpecialty}
                </Typography>
                </div>
            </div>
            </div>
            <div className='messages'>
                {messages.map((message, index) => (
                    <Message key={index} text={message.message} sent={message.sender === currentUserId}/> //sent={message.sent}
                ))}
                <div ref={messagesEndRef} /> {/* Reference for scrolling */}
            </div>
            <MessageInput handleSendMessage={handleSendMessage} handleInputChange={handleInputChange} inputValue={inputValue}/>
        </div>
    );
}