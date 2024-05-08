
import React, { Fragment, useState } from 'react';
import "./css/navbar.css"
import {Link, Navigate} from "react-router-dom"
import { connect } from 'react-redux';
import { logout } from '../actions/auth';

const Navbar = ({ logout, isAuthenticated }) => {
  const [redirect, setRedirect] = useState(false);

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
        <li className='nav-item'>
            <a className='nav-link' href='#!' onClick={logout_user}>Logout</a>
        </li>
    );
  return (
    <Fragment>
    <nav className="nav-container">
      <ul className="nav-list">
        <li className="nav-item"><button className="nav-button">Your Work</button></li>
        
        <li className="nav-item dropdown">
          <button className="nav-button">Project</button>
          <i className='bx bxs-chevron-down dropdown-arrow'></i>
          <div className="dropdown-content">
           
              <button  className="nav-button" >project1</button>
           
            <button className="nav-button">View all Projects</button>
          </div>
        </li>
        <li className="nav-item"><button className="nav-button">Teams</button></li>
        {isAuthenticated ? authLinks() : guestLinks()}
        
      </ul>
      {redirect ? <Navigate to ="/" /> : <Fragment></Fragment>}
    </nav>
    </Fragment>
  );


}
const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});
export default connect(mapStateToProps, { logout })(Navbar)
