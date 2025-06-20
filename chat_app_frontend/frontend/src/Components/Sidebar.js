import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar() {
    // The sidebar menu when not logged in
    return (
        <div className="sidebar">
            <Link to='/' className="sidebar-link">Login</Link>
            <Link to='/register' className="sidebar-link">Register</Link>
        </div>
    );
}