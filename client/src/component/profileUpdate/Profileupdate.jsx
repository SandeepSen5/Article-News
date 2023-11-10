import * as yup from 'yup';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Profileupdate.css";

const userSchema = yup.object().shape({
    name: yup.string().required("Name is required").trim(), // Adding .trim() to remove leading/trailing whitespaces
    email: yup.string().email("Invalid email format").required("Email is required").trim(),
    number: yup
        .string()
        .required("Number is required")
        .min(10, "Number must be 10 characters")
        .max(10, "Number can't exceed 10 characters")
        .trim(),
})
    .test('blank-check', 'Please fill out all fields.', (values) => {
        // Check if any of the fields are blank (empty or whitespace-only)
        return Object.values(values).every((value) => value.trim() !== '');
    });

export default function Profileupdate() {

    const [value, setValue] = React.useState('1');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [dob, setDob] = useState('');
    const [cat, setCat] = useState([]);
    const [oldpassword, setPassword] = useState('');
    const [newpassword, setNewPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});


    const { user } = useSelector((state) => state.user);
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        if (user) {
            axios.get('/getuserdetails').then((response) => {
                setName(response.data.name);
                setEmail(response.data.email);
                setNumber(response.data.number);
                setCat(response.data.cat);
                const isoDate = new Date(response.data.dob);
                const formattedDate = isoDate.toISOString().split('T')[0];
                setDob(formattedDate);
            })
        } else {
            setRedirect('/login');
        }
    }, [])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    async function userUpdate(ev) {
        ev.preventDefault();
        try {
            await userSchema.validate({ name, email, number }, { abortEarly: false });
            await axios.post('/updateuser', {
                name, email, number, dob, cat
            });
            notify("Update Successfully")
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            }
            else {
                notify(error.response.data);
            }
        }
    }

    async function updatePassword(ev) {
        ev.preventDefault();
        try {
            await axios.post('/updatepassword', {
                oldpassword, newpassword, confirmpassword
            });
            notify("Update Successfully")
        } catch (error) {
            notify(error.response.data);
        }
    }

    function handleCbClick(ev) {
        // ev.target.name;
        console.log(ev.target.name)
        console.log(ev.target.checked)
        const { checked, name } = ev.target;
        if (checked) {
            setCat([...cat, name])
        } else {
            setCat([...cat.filter(selectedName => selectedName != name)])
        }
    }

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label="Profile Update" value="1" />
                        <Tab label="Password Update" value="2" />

                    </TabList>
                </Box>
                <TabPanel value="1">
                    <form className='setting Form' onSubmit={userUpdate}>
                        {/* <label className='text-sm'>Profile Picture</label>
                        <div className='settingsPP'>
                            <img src='https://images.pexels.com/photos/3697601/pexels-photo-3697601.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='' />
                            <label htmlFor='fileInput'><i className="settingsPPIcon fa-solid fa-user"></i></label>
                            <input type="file" id='fileInput' style={{ display: "none" }} />
                        </div> */}
                        <div className='data mt-10'>
                            {/* <label className='labelData'>UserName</label> */}

                            <input type='text' value={name} placeholder='UserName' onChange={(e) => { setName(e.target.value) }} className='p-1 rounded-xl' />
                            {errors.name && <div className="text-red-500">{errors.name}</div>}
                        </div>
                        <div className='data mt-10'>
                            {/* <label className='labelData'>Email</label> */}
                            <input type='email' value={email} placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} className='p-1 rounded-xl' />
                            {errors.email && <div className="text-red-500">{errors.email}</div>}
                        </div>
                        <div className='data mt-10'>
                            {/* <label className='labelData'>Password</label> */}
                            <input type="text" value={number} placeholder="Phone Number" onChange={(e) => { setNumber(e.target.value) }} className='p-1 rounded-xl' />
                            {errors.number && <div className="text-red-500">{errors.number}</div>}
                        </div>
                        {/* <div>
                            <select className="mt-5  loginInputs p-1 rounded-xl" value={cat} onChange={(e) => { setCat(e.target.value) }}>
                                <option value="">Select Your Preference</option>
                                <option value="Sports">Sports</option>
                                <option value="Politics">Politics</option>
                                <option value="Travel">Travel</option>
                                <option value="Trending">Trending</option>
                            </select>
                        </div> */}

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-3">

                            <label className="border p-4 flex rounded-2xl gap-2 items-center">
                                <input type="checkbox" checked={cat.includes('Sports')} name="Sports" onChange={handleCbClick} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                                </svg>
                                <span>Sports</span>
                            </label>
                            <label className="border p-4 flex rounded-2xl gap-2 items-center">
                                <input type="checkbox" checked={cat.includes('Politics')} name="Politics" onChange={handleCbClick} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                                    <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
                                </svg>

                                <span>Politics</span>
                            </label>
                            <label className="border p-4 flex rounded-2xl gap-2 items-center">
                                <input type="checkbox" checked={cat.includes('Travel')} name="Travel" onChange={handleCbClick} />
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                                    <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
                                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clip-rule="evenodd" />
                                </svg>

                                <span>Travel</span>
                            </label>
                            <label className="border p-4 flex rounded-2xl gap-2 items-center">
                                <input type="checkbox" checked={cat.includes('Trending')} name="Trending" onChange={handleCbClick} />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                                </svg>
                                <span>Trending</span>
                            </label>
                        </div>
                        <div>
                            <input type="date" value={dob} className="mt-8 loginInputs pr-14 pl-2 p-1 rounded-xl" onChange={(e) => { setDob(e.target.value) }} />
                        </div>
                        <button className='settingsSubmit mt-10'>Submit</button>
                        <ToastContainer />
                    </form>
                </TabPanel>
                <TabPanel value="2">
                    <form className='setting Form' onSubmit={updatePassword}>
                        <div className='data mt-10'>
                            <input type="password" value={oldpassword} placeholder="Old Password" onChange={(e) => { setPassword(e.target.value) }} className='loginInputs' />
                        </div>
                        <div className='data mt-10'>
                            <input type="password" value={newpassword} placeholder="New Password" onChange={(e) => { setNewPassword(e.target.value) }} className='loginInputs' />
                        </div>
                        <div className='data mt-10'>
                            <input type="password" value={confirmpassword} placeholder="Confirm Password" onChange={(e) => { setConfirmPassword(e.target.value) }} className='loginInputs' />
                        </div>
                        <button className='settingsSubmit mt-10'>Submit</button>
                        <ToastContainer />
                    </form>
                </TabPanel>

            </TabContext>
        </Box>
    );
}