import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import "./write.css";

export default function Write() {

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [photo, setPhoto] = useState('');
    const { user } = useSelector(state => state.user)
    const [cat, setCat] = useState([]);
    const [redirect, setRedirect] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user) {
            setRedirect('/login')
        }
        if (id) {
            axios.get('/singlepost/' + `${id}`).then((response) => {
                setTitle(response.data.title);
                setDesc(response.data.desc);
                setPhoto(response.data.photo);
                setCat(response.data.cat);
            }).catch(err => { console.log(err) })
        }
    }, [user])

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

    function uploadPhoto(ev) {
        const files = ev.target.files;
        console.log({ files });
        const data = new FormData();
        for (let i = 0; i < files.length; i++) {
            data.append('photos', files[i]);
        }
        console.log("data", data, files);
        axios.post('/upload', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((response) => {
            const { data } = response;
            console.log(data, "uploadedddddddddddd")
            setPhoto((prev) => {
                return [...prev, ...data];
            });
        });
    }

    const handlePost = async (e) => {
        e.preventDefault();
        const name = user.name;
        try {
            await axios.post('/post', {
                title, photo, desc, cat, name, id
            });
            notify("Success");
            navigate('/');
            return <Navigate to={redirect} />
        }
        catch (error) {
            console.log(error.response.data);
            notify(error.response.data);
        }
    }

    function handleCbClick(ev) {
        // ev.target.name;
        console.log(ev.target.name)
        console.log(ev.target.checked)
        const { checked, name } = ev.target;
        if (checked) {
            setCat(name)
        }
    }

    return (
        <div className='write'>
            {photo.length > 0 && <img src={"https://www.letsblog.fun/uploads/" + photo} alt='' className='writeImg' />}
            {photo.length < 1 && <img src={"https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" + photo} alt='' className='writeImg' />}
            <form action='' className='writeForm' onSubmit={handlePost}>
                <div className="writeFormGroup mt-5">
                    <label htmlFor='fileInput'>
                        <i className="writeIcon fa-solid fa-image"></i>
                    </label>
                    <span>Add Image</span>
                    <input type='file' id='fileInput' style={{ display: "none", width: "50%" }} multiple onChange={uploadPhoto} />

                </div>

                <div className="writeFormGroup mt-2">

                    <input type="text" value={title} placeholder='Title' className='writeInput mt-5 rounded-xl ml-2 border:1px' autoFocus={true} onChange={(e) => { setTitle(e.target.value) }} />
                </div>

                {/* <div className="writeFormGroup">
                    <select className="mt-5 loginInputs p-1" value={cat} onChange={(e) => { setCat(e.target.value) }} style={{ width: '80%' }}>
                        <option value="">Select Your Preference</option>
                        <option value="Sports">Sports</option>
                        <option value="Politics">Politics</option>
                        <option value="Travel">Travel</option>
                        <option value="Trending">Trending</option>
                    </select>
                </div> */}

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-10 writeFormGroup ">

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

                <div className='writeFormGroup'>
                    <textarea placeholder='Your Story' value={desc} type="text" className='writeInputtext writeText mt-5 rounded-xl ml-2' onChange={(e) => { setDesc(e.target.value) }}></textarea>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button type="submit" className='px-6 py-3 rounded-xl my-20' style={{ backgroundColor: 'teal' }}>Submit</button>
                </div>
                <ToastContainer />
            </form>
            <div>   

            </div>
        </div>
    )
}   
