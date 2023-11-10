
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../redux/slice/userSlice';
import "./login.css";


export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(null);
    const [errors, setErrors] = useState({});
    const { user, usermessage } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setRedirect('/');
        }
    }, [user]);

    useEffect(() => {
        if (usermessage) {
            notify(usermessage);
        }
    }, [usermessage]);

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    const notify = (error) => toast.info(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });

    async function handleLogin(ev) {
        ev.preventDefault();
        try {
            const userdata = { email, password };
            dispatch(login(userdata));
        } catch (error) {
            notify(error.response.data);
        }
    }
    
    return (
        <div className='login'>
            <span className="loginTitle">#Login</span>
            <form className='loginForm' onSubmit={handleLogin}>
                <label>Username</label>
                <input type="text" value={email} placeholder="Username" onChange={(e) => { setEmail(e.target.value) }} className='loginInputs' />
                <label>Password</label>
                <input type="password" value={password} placeholder="Password" onChange={(e) => { setPassword(e.target.value) }} className='loginInputs' />
                <button className='loginButton'>Login</button>
                <div className="text-center py-2 text-white">
                    Doesn't have an Account?
                    <Link className="text-white" to={'/register'}>
                        Register Now
                    </Link>
                </div>
                <ToastContainer />
            </form>
        </div>
    )
}





