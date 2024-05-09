import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CreateIssueForm from './CreateIssueForm';
import './css/sprint.css'
import IssueStatus from './issueStatus';
import IssueType from './issuseType';
import Backlog from './Backlog';
import IssueForm from './IssueForm';
// import assignee from "/assignee.png";

const Sprint = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectid');
  console.log(projectId);

  // State to manage form visibility
  const [formOpen, setFormOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [InputField, setInputField] = useState(false);
  const [buttonShow, setbuttonShow] = useState(true);
  const [inputValues, setInputValues] = useState([]);

  // Function to open form
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
  
  const showInputField = () => {
    setInputField(!showDropdown); 
    setbuttonShow(false)
    
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setInputField(false); 
      setbuttonShow(true)
      setInputValues([...inputValues, event.target.value]);
      event.target.value = ''; 
    }
  };
  console.log("hereee")
 console.log(showDropdown)

  return (
    <>
    <div>
      <h1>Backlog Page</h1>
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
    <Backlog />
    </>
  );
};

export default Sprint;
