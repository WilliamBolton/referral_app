import logo from './logo.svg';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import Sidebar from './Components/Sidebar';
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import ChatContainer from './Components/ChatContainer';
import HomeContainer from './Components/HomeContainer'
import ReferralContainer from './Components/ReferralContainer';
import AIChatContainer from './Components/AIChatContainer';

function App() {
  const isAuthenticated = () => {
    // Ensures a user is authenticated 
    const authToken = getAuthTokenFromCookie();
    return authToken !== null;
  };

  const getAuthTokenFromCookie = () => {
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
      <BrowserRouter>
        <div className="app-container">
          {!isAuthenticated() && <Sidebar />} {/* Render sidebar only if not authenticated */}
          <Routes>
            {/* Redirect authenticated users to /home */}
            <Route path="/" element={isAuthenticated() ? <Navigate to="/home" /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={isAuthenticated() ? <HomeContainer /> : <Navigate to="/" />} />
            <Route path="/:email" element={<ChatContainer />} />
            <Route path="/referral/:email" element={<ReferralContainer />} />
            <Route path="/ai_chat/:email" element={<AIChatContainer />} />
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

export default App;
