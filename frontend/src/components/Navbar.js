import React, { Fragment, useState,useEffect  } from 'react';
import { Link, Navigate } from "react-router-dom"
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import "./css/navbar.css";
import axios from 'axios';

const Navbar = ({ logout, isAuthenticated,user }) => {
    const [redirect, setRedirect] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/djapp/project_list/', {
                    params: { email: user.email }
                });
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [user]);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const logout_user = () => {
        logout();
        setRedirect(true);
    };

    const guestLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <Link className='nav-link' to='/login'>Login</Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signup'>Sign Up</Link>
            </li>
        </Fragment>
    );

    const authLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <a className='nav-link' href='#!' onClick={logout_user}>Logout</a>
            </li>
        </Fragment>
    );

    return (
        <Fragment>
            <nav className="nav-container">
                <ul className="nav-list">
                    <li className="nav-item">Salty</li>
                    <li className="nav-item"><button className="nav-button">Your Work</button></li>
                    <li className={`nav-item dropdown ${isDropdownOpen ? 'open' : ''}`}>
                        <button className="nav-button dropbtn" onClick={toggleDropdown}>Projects</button>
                        {projects.map(project => (
                        <div className="dropdown-content">
                            <Link to="/projects/project1">{project.projectname}</Link>
                        </div>
                        ))}
                    </li>
                    <li className="nav-item"><button className="nav-button">Filters</button></li>
                    <li className="nav-item"><button className="nav-button">Teams</button></li>
                    {isAuthenticated ? authLinks() : guestLinks()}
                </ul>
                {redirect ? <Navigate to="/" /> : null}
            </nav>
        </Fragment>
    );
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user:state.auth.user
});

export default connect(mapStateToProps, { logout })(Navbar);
