import * as yup from 'yup';
import { useState } from 'react';
import './register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const userSchema = yup.object().shape({
    name: yup.string().required("Name is required").trim(), // Adding .trim() to remove leading/trailing whitespaces
    email: yup.string().email("Invalid email format").required("Email is required").trim(),
    number: yup
        .string()
        .required("Number is required")
        .min(10, "Number must be 10 characters")
        .max(10, "Number can't exceed 10 characters")
        .trim(),
    password: yup
        .string()
        .required("Password is required")
        .min(4, "Password must be at least 4 characters")
        .max(10, "Password can't exceed 10 characters")
        .trim(),
})
.test('blank-check', 'Please fill out all fields.', (values) => {
    // Check if any of the fields are blank (empty or whitespace-only)
    return Object.values(values).every((value) => {
        if (typeof value === 'string') {
            return value.trim() !== '';
        }
        return true; // Return true for non-string values
    });
});


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmPassword] = useState('');
    const [dob, setDob] = useState('');
    const [cat, setCat] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const notify = (error) => toast.info(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    });

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            await userSchema.validate({ name, email, number, password, dob }, { abortEarly: false });
            await axios.post('/register', {
                name, email, number, password, dob, cat, confirmpassword
            })
            navigate("/login")
        }
        catch (error) {
            if (error instanceof yup.ValidationError) {
                const newErrors = {};
                error.inner.forEach(err => {
                    newErrors[err.path] = err.message;
                });
                setErrors(newErrors);
            } else if (error.response && error.response.data) {
                notify(error.response.data);
            } else {
                console.error(error); 
            }
        }
    }

    return (
        <div className="mt-8 flex items-center justify-around register">
            <div className="mt-8">
                <h1 className="text-4xl text-center mb-4 title">#Register</h1>
                <form className="flex flex-col" onSubmit={registerUser}>
                    <div className="flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <input type="text" value={name} placeholder="Name" className="mt-5 loginInputs" onChange={(e) => { setName(e.target.value) }} />
                            {errors.name && <div className="text-white">{errors.name}</div>}
                        </div>
                        <div className="w-1/2 pl-2">
                            <input type="email" value={email} placeholder="Email" className="mt-5 loginInputs" onChange={(e) => { setEmail(e.target.value) }} />
                            {errors.email && <div className="text-white">{errors.email}</div>}
                        </div>
                    </div>

                    <div className="flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <input type="text" value={number} placeholder="Phone Number" className="mt-5 loginInputs" onChange={(e) => { setNumber(e.target.value) }} />
                            {errors.number && <div className="text-white">{errors.number}</div>}
                        </div>
                        <div className="w-1/2 pl-2">
                            <input type="date" value={dob} className="mt-5 loginInputs pr-14 pl-2" onChange={(e) => { setDob(e.target.value) }} />
                            {errors.dob && <div className="text-white">{errors.dob}</div>}
                        </div>
                    </div>

                    <div className="flex flex-wrap">
                        <div className="w-1/2 pr-2">
                            <input type="password" value={password} placeholder="Password" className="mt-5 loginInputs" onChange={(e) => { setPassword(e.target.value) }} />
                            {errors.password && <div className="text-white">{errors.password}</div>}
                        </div>
                        <div className="w-1/2 pl-2">
                            <input type="password" value={confirmpassword} placeholder="Confirm Password" className="mt-5 loginInputs" onChange={(e) => { setConfirmPassword(e.target.value) }} />
                        </div>
                    </div>

                    <select value={cat} className="mt-5 loginInputs" onChange={(e) => { setCat(e.target.value) }}>
                        <option value="">Select Your Preference</option>
                        <option value="Sports">Sports</option>
                        <option value="Politics">Politics</option>
                        <option value="Travel">Travel</option>
                        <option value="Trending">Trending</option>
                    </select>

                    <button className="primary mt-4 loginInputs">Register</button>

                    <div className="text-center py-2 text-white">
                        Already a Member?
                        <Link className="text-white" to={'/login'}>
                            Login Now
                        </Link>
                    </div>
                    <ToastContainer />
                </form>
                <div className="text-center mt-5 rounded-2xl"></div>
            </div>
        </div>
    );
}
