import React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Sidebar from '../../component/sidebar/sidebar';
import Profileupdate from '../../component/profileUpdate/Profileupdate';
import "./settings.css";

export default function Settings() {

    const { user } = useSelector((state) => state.user);
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        if (!user) {
            setRedirect('/login')
        }
    }, [user])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className='settings'>
            <div className="settingsWrapper">
                <Profileupdate />
            </div>
            <Sidebar />
        </div>
    )
}
