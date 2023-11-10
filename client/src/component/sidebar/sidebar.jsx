import React from 'react';
import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div className="sidebarItem">
                <span className='sidebarTitle'>About Blog</span>
                <img src='https://images.pexels.com/photos/704767/pexels-photo-704767.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' alt='' />
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
            </div>

            <div className="sidebarItem">
                <span className='sidebarTitle'>Categories</span>
                <ul className='sidebarList'>

                    <li className='sidebarListItem'>
                        <Link to={`/category?name=Sports`}>
                            Sports
                        </Link>
                    </li>

                    <li className='sidebarListItem'>
                        <Link to={`/category?name=Politics`}>
                            Politics
                        </Link>
                    </li>

                    <li className='sidebarListItem'>
                        <Link to={`/category?name=Travel`}>
                            Travel
                        </Link>
                    </li>
                    <li className='sidebarListItem'>
                        <Link to={`/category?name=Trending`}>
                            Trending
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
