import React from 'react';
import "./header.css";

export default function Header() {
    return (
        <div className='header'>
            <div className="headerTitles">
                <span className='headerTitlesm'></span>
                <span className='headerTitleLg'></span>
            </div>
            <img className='headerImg rounded-2xl' src='https://images.pexels.com/photos/1577882/pexels-photo-1577882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='' />
        </div>
    )
}

