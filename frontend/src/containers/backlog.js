import React, { useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './css/sprint.css';
import IssueType from './issuseType';
import { connect } from 'react-redux'; // Import connect from react-redux
import { addIssue } from '../actions/auth';
import IssueStatus from './issueStatus';
import { clickProject } from '../actions/auth'; 


import Add_team_members from './Add_team_members';


const Backlog = ({ addIssue}) =>  {
  const [inputValues, setInputValues] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [InputField, setInputField] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);
  const [draggedEle, setDragged] = useState([]);
  const {projectid}=useParams();






  const showInputField = () => {
    setInputField(!showDropdown);
    setButtonShow(false);
  };
  

  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      setInputField(false);
      setButtonShow(true);
      setInputValues([...inputValues, event.target.value]);

      
      try {
        await addIssue({ issueName: event.target.value,projectId:projectid,sprint:null,assigned_epic:null });
      } catch (error) {
        console.error('Error creating project:', error);
      }
      event.target.value = '';
    }
};

  return (
    
    <>
     
      <div className={inputValues.length ? 'solid-box' : 'dotted-box'}>
        
        {inputValues.map((value, index) => (
          <div key={index} className="input-item" >
            <div className='value'>{value}</div>
            <div className="right">
              <IssueStatus />
            </div>
            <img src="/assignee.png" alt="assignee" id="userIcon" />
          </div>
        ))}
      </div>
      <div className="create-issue">
        {buttonShow && <button onClick={showInputField}>Create Issue</button>}
        {InputField && (
          <div className="issueCreation">
            <IssueType />
            <input type="text" placeholder="type your issue here" onKeyDown={handleKeyPress} />
          </div>
        )}
      </div>
      
    </>
  );
}



export default connect( null,{ addIssue })(Backlog); // Connect the component to the Redux store and add the addIssue action
