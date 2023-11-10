import React from 'react';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import "./single.css";
import Sidebar from '../../component/sidebar/sidebar';
import Singlepost from '../../component/singlepost/singlepost';

export default function Single() {

    const { user } = useSelector((state) => state.user);
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        if (!user) {
            setRedirect('/login')
        }
    })

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="single">
            <Singlepost />
            <Sidebar />
        </div>
    )
}
