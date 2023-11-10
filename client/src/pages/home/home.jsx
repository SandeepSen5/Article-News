import React from 'react';
import "./home.css";
import Header from '../../component/header/header';
import Posts from '../posts/posts';
import Sidebar from '../../component/sidebar/sidebar';

export default function home() {
    return (
        <>
            <Header />
            <div className='home'>
                <Posts />
                <Sidebar />
            </div>
        </>

    )
}




