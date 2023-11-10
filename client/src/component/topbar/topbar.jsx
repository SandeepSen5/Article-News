import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from '../../redux/slice/userSlice';
import './topbar.css';

export default function Topbar() {
    const [redirect, setRedirect] = useState(null);
    const { user } = useSelector((state) => state.user);
    console.log(user, "user")
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        setRedirect('/');
    }, [user])


    const handlelogout = () => {
        dispatch(logout());
        dispatch(reset());
        setRedirect('/');
    }

    const handlelogin = () => {
        navigate('/login');
    }

    if (redirect) {
        <Navigate to={redirect} />;
    }

    return (
        <div className='top'>
            <div className="topleft">
                <i className="topIcon fa-brands fa-square-facebook"></i>
                <i className=" topIcon fa-brands fa-instagram"></i>
                <i className="topIcon fa-brands fa-square-pinterest"></i>
                <i className="topIcon fa-brands fa-square-twitter"></i>
            </div>
            <div className="topcenter">
                <ul className="topList">
                    <li className='topListItem'><Link to={'/'}>Home</Link></li>
                    <li className='topListItem'><Link to={'/mypost'}>My Articles</Link></li>
                    <li className='topListItem'><Link to={'/profile'}>Profile</Link></li>
                    <li className='topListItem'><Link to={'/write'}>Write</Link></li>

                </ul>
            </div>
            <div className="topright">
                <Link to={'/profile'}><img className='topImg' src='https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600' /></Link>
                {user && <p className='pl-2'>Hai {user.name}</p>}
                {user && <button onClick={handlelogout} className='pl-10'>Logout</button>}
                {!user && <button onClick={handlelogin} className='pl-5'>Login</button>}
            </div>
        </div>
    )
}
