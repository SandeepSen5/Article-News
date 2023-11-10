import "./post.css";
import React from 'react'
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";


export default function Post() {
    const [posts, setPosts] = useState([])
    const { user } = useSelector((state) => state.user);
    const [redirect, setRedirect] = useState(null);

    useEffect(() => {
        if (user) {
            axios.get('/getposts').then((response) => {
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
        <>
            {posts.map((post) => (
                <Link to={'/post/' + post._id}>
                    <div className="post" key={post.id}>
                        <img
                            className="postImg rounded-2xl"
                            src={"http://localhost:4000/uploads/" + post.photo}
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


    )
}
