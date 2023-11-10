import React from 'react'
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { Navigate, useParams, Link ,useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Categorypost() {

    const { user } = useSelector((state) => state.user);
    
    const [posts, setPosts] = useState([])
    const [redirect, setRedirect] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('name');
    

    useEffect(() => {
        if (user) {
            axios.get('/getcatpost/' + id).then((response) => {
                setPosts(response.data);
            })
        } else {
            setRedirect('/login');
        }
    }, [user])

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-20 gap-x-6 gap-y-6">
            <>
                {posts.map((post) => (
                    <Link to={'/post/' + post._id}>
                        <div className="post" key={post.id}>
                            <img
                                className="postImg rounded-2xl"
                                src={"https://www.letsblog.fun/uploads/" + post.photo}
                                alt=""
                            />
                            <div className="postInfo">
                                <div className="postCats">
                                    <span className="postCat">{post.cat}</span>
                                </div>
                                <span className="postTitle">{post.title}</span>
                                <hr />
                                <span className="postDate">{post.date}</span>
                            </div>
                            <p className="postDesc">
                                {post.desc}
                            </p>
                        </div>
                    </Link>
                ))}
            </>
        </div>
    )
}



