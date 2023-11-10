import React from 'react';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./singlepost.css";

export default function Singlepost() {

    const [post, setPost] = useState([]);
    const { id } = useParams();
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        if (id) {
            axios.get('/singlepost/' + `${id}`).then((response) => {
                setPost(response.data);
            }).catch(err => { console.log(err) })
        }
    }, [])

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

    const handleDelete = async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('/deletepost/' + id).then(() => {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
                        icon: "success"
                    });
                })
            }
        });
    }

    const handleLike = () => {
        axios.get('/getLikes/' + id).then((response) => {
            notify("Liked the Article");
        }).catch((error) => {
            notify(error.response.data);
        })
    }
    

    const handledisLike = () => {
        axios.get('/getdisLikes/' + id).then((response) => {
            notify("Post Disliked");
        }).catch((error) => {
            notify(error.response.data);
        })
    }

    return (
        <div className='singlePost'>

            <div className="singlePostWrapper">
                {post.photo && <img src={"http://www.letsblog.fun/uploads/" + post.photo[0]} alt='' className='singlePostImg' />}
                {post.title && <h1 className="singlePostTitle">{post.title}</h1>}
                <div className='singlePostEdit' >
                    {post && user && post.userid?._id == user._id &&
                        <>
                            <Link to={"/write/" + post._id}>
                                <i className="singlePostIcon fa-regular fa-pen-to-square"></i>
                            </Link>
                            <button onClick={handleDelete}><i className="singlePostIcon fa-regular fa-trash-can"></i></button>
                        </>
                    }
                </div>
                <div className="singlePostInfo">
                    {post.username && <span className='singlePostAuthor'>Author:<bold>{post.username}</bold></span>}
                </div>
                <div className="flex items-center justify-end pr-2">
                    <button onClick={handleLike}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg></button>
                    <button className='ml-3' onClick={handledisLike}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                        </svg>
                    </button>
                </div>
                <p className='singlePostDesc'>
                    {post.desc && post.desc}
                </p>
                <ToastContainer />
            </div>

        </div >
    )
}
