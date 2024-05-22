import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { GoPersonFill } from "react-icons/go";
import './css/navbar.css';
import axios from 'axios';

const Navbar = ({ logout, isAuthenticated, user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const dropdownRef = useRef(null);
    const navigate = useNavigate(); // Use useNavigate hook

    useEffect(() => {
        if (user) {
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
        }
    }, [user]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const logoutUser = () => {
        logout();
        navigate('/'); // Programmatically navigate to the login page
    };

    const guestLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <Link className='nav-link' to='/login'>
                    Login
                </Link>
            </li>
            <li className='nav-item'>
                <Link className='nav-link' to='/signup'>
                    Sign Up
                </Link>
            </li>
        </Fragment>
    );

    const authLinks = () => (
        <Fragment>
            <li className='nav-item'>
                <a className='nav-link' href='#!' onClick={logoutUser}>
                    Logout
                </a>
            </li>
        </Fragment>
    );

    const openProfile = () => {
        navigate('/profile');
    };

    const openMyIssues = () => {
        navigate('/myissues');
    };

    return (
        <Fragment>
            <nav className='nav-container'>
                <ul className='nav-list'>
                    <li className='nav-item'>
                        <button className='nav-button'>Salty</button>
                    </li>
                    <li className='nav-item'>
                        <button className='nav-button'>Your Work</button>
                    </li>
                    <li className='nav-item'>
                        <button className='nav-button' onClick={toggleDropdown}>Project</button>
                        {isDropdownOpen && (
                            <ul className='dropdown' ref={dropdownRef}>
                                {projects.map(project => (
                                    <li key={project.id}>
                                        <Link to={`/project/${project.projectid}/backlog`} className='dropdown-item'>{project.projectname}</Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>

                    {isAuthenticated && (
                        <Fragment>
                            <li className='nav-item'>
                                <button className='nav-button' onClick={openMyIssues}>My Issues</button>
                            </li>
                        </Fragment>
                    )}

                    {isAuthenticated ? authLinks() : guestLinks()}
                </ul>

                {isAuthenticated && (
                    <Fragment>
                        <li className='nav-items'>
                            <button onClick={openProfile} className='person'><GoPersonFill /></button>
                        </li>
                    </Fragment>
                )}
            </nav>
        </Fragment>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

export default connect(mapStateToProps, { logout })(Navbar);
