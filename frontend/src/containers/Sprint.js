import React, { useState , useEffect} from 'react';
import { useLocation, useParams } from 'react-router-dom';

import './css/sprint.css'
import { connect } from 'react-redux'; 
import IssueStatus from './issueStatus';

import Backlog from './Backlog';
import Add_team_members from './Add_team_members';

import axios from 'axios';
import IssueForm from './IssueForm';
// import assignee from "/assignee.png";



const Sprint = ({token}) => {
 const {projectid}=useParams()
 console.log(token)
 const [issues, setissues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      
      try {
        const response = await axios.get("http://localhost:8000/djapp/issues/", 
        {
          params: { projectId: projectid}
      },
        );
        console.log(response)
        setissues(response.data);
        console.log(issues) 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    

    fetchIssues(); // Fetch issues when component mounts
  }, [projectid]); 

  
  const [formOpen, setFormOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [InputField, setInputField] = useState(false);
  const [buttonShow, setbuttonShow] = useState(true);
  const [inputValues, setInputValues] = useState([]);

 
  const openForm = () => {
    setFormOpen(true);
  };

  // Function to close form
  const closeForm = () => {
    setFormOpen(false);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); 
  };
  
  console.log("hereee")
 console.log(showDropdown)

  return (
    <>
    <div>
      <h1>Backlog Page</h1>
      
      <Add_team_members projectid={projectid} />
      <button onClick={openForm}>Create</button>
      {formOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeForm}>&times;</span>
              <IssueForm onClose={closeForm} />
            </div>
          </div>
        )}
    </div>
    <div className="mainBox">
      
      
      {/* Additional div with sprint details */}
      <div className="sprint-details">
        <div className="left-section">
          <div className='chotadabba1'>Sprint Name</div >
          <div className='chotadabba'>Start Date</div >
          <div className='chotadabba2'>End Date</div >
        </div>
        <div className="right-section">
          <div>
          <button  >Complete Sprint</button></div>
          
            
            <div className="dropdown" onClick={toggleDropdown}>...</div>
            </div>
            
            {showDropdown && (
              <div className="dropdown-content">
                <span>Edit</span>
                <span>Delete</span>
              </div>
            )}
          
        </div>
     
      <Backlog />
      </div>
      {/* here i wanna pass all the  issue */}
    <Backlog />
    </>
  );
};
const mapStateToProps = (state) => ({
  token:state.auth.access
   
 });

 export default connect(mapStateToProps)(Sprint);
