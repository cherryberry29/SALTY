import React from 'react';
import { AiFillCaretRight } from "react-icons/ai";
import "./css/Hpage.css";
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleLoginButton = () => {
    navigate('/login');
  };

  const moveToProjects = () => {
    navigate('/projects');
  }

  return (
    <div className="container">
      {!isAuthenticated ? (
        <div className="content">
          <h1 className="firstLine">A Powerful App For Your</h1>
          <h1 className="secondLine">Tracking Your Projects.</h1>
          <h3 className="firstline">From open source to pro services, Piqes helps you to build, deploy, test,</h3>
          <h3>and monitor apps.</h3>
          <div className="button-div">
            <button type="button" className="GooglePlay buttons" onClick={handleLoginButton}>
              <AiFillCaretRight className="apple-icon" />
              Continue to Use 
            </button>
          </div>
        </div>
      ) : (
        // <button onClick={moveToProjects} className="project-button">
        //   Move to Projects
        // </button>
         <Link to={`/project/`} >hh</Link>
      )}
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated // Assuming the user information is stored in the 'auth' slice of the Redux state
});

export default connect(mapStateToProps)(Home);
