import React, { useState, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'
import { Avatar, Typography} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'

export default function ChatArea() {
    // The chat interface where users can interact with the AI assistant
    const location = useLocation();
    const [messages, setMessages] = useState([]);
    const currentUser = {
        token: getAuthTokenFromCookie(),
        email: jwtDecode(getAuthTokenFromCookie()).email, // Decode email from the token
    };
    const [currentUserId, setCurrentUserId] = useState(null);
    console.log('User email:', currentUser.email);
    const [ws, setWs] = useState(null);
    const aimessagesEndRef = useRef(null); // Create a ref for the messages container element to scroll to

    useEffect(() => {
        connectToWebSocket(); // Connect to WebSocket when component mounts
        fetchAIMessages(); // Fetch historical messages when component mounts

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
    }, []);

    const connectToWebSocket = () => {
        // Establish WebSocket connection
        const websocket = new WebSocket(`ws://127.0.0.1:8000/ws/ai_chat/${currentUser.email}/?token=${currentUser.token}`);
        websocket.onopen = () => {
            console.log('WebSocket connection established');
            console.log(websocket.url);
            setWs(websocket); // Set WebSocket connection in state
            aimessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        };
        websocket.onmessage = (message) => {
            console.log('Received message:', message);
            fetchAIMessages(); // Fetch messages when a new message is received
            aimessagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        };
        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    };

    const fetchAIMessages = () => {
        // Fetches all messages for the particular user
        fetch('http://127.0.0.1:8000/api/ai_messages/', {
            method: 'POST', // Use POST method as GET did not work?
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.token}`
            },
            body: JSON.stringify({
                sender: currentUser.email
            })
        })
        .then(res => res.json())
        .then(message_data => {
            console.log('Message data:', message_data);
            setMessages(message_data);
            aimessagesEndRef.current.scrollIntoView({ behavior: 'smooth' }); // Scroll to the bottom after fetching messages
        })
        .catch(error => {
            console.error('Error fetching message data:', error);
        });
    };

    console.log('currentUserId', currentUserId)
    
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
            }));
            setInputValue('');
            fetchAIMessages();
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
                <SmartToyIcon fontSize="large"/>
                </Avatar>
                <div style={{ marginLeft: '20px' }}>
                <Typography variant="body1" color="textPrimary" sx={{ fontSize: '1.8rem' }}>
                    AI Assistant
                </Typography>
                </div>
            </div>
            </div>
            <div className='messages'>
                {messages.map((message, index) => (
                    <Message key={index} text={message.message} sent={message.message_from === 'user'}/> //sent={message.sent}
                ))}
                <div ref={aimessagesEndRef} /> {/* Reference for scrolling */}
            </div>
            <MessageInput handleSendMessage={handleSendMessage} handleInputChange={handleInputChange} inputValue={inputValue}/>
        </div>
    );
}