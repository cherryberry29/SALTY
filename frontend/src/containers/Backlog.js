import React, { useState,useEffect} from 'react';
import { useParams } from 'react-router-dom';
import './css/sprint.css';
import IssueType from './issuseType';
import { connect } from 'react-redux'; // Import connect from react-redux
import { addIssue } from '../actions/auth';
import IssueStatus from './issueStatus';
const Backlog = ({ addIssue,issuesList = [],sprint_name}) =>  {
  const [inputValues, setInputValues] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [InputField, setInputField] = useState(false);
  const [buttonShow, setButtonShow] = useState(true);
  const [selectedIssueType, setSelectedIssueType] = useState('Story');
   const {projectid}=useParams();
  console.log(projectid)

  const showInputField = () => {
    setInputField(!showDropdown);
    setButtonShow(false);
  };
  const getIssueIcon = (issueType) => {
    switch (issueType) {
      case 'Bug':
        return '/bug.jpg';
      case 'Task':
        return '/task.jpg';
      default:
        return '/story.jpg';
    }
  };
  
  
  const handleKeyPress = async (event) => {
    if (event.key === 'Enter') {
      const newIssue = {
        IssueName: event.target.value,
        IssueType: selectedIssueType,
        projectId: projectid,
        sprint: sprint_name,
        assigned_epic: null,
      };

      try {
        await addIssue(newIssue);
        setInputValues([...inputValues, newIssue]); // Update local state with the new issue
        
      } catch (error) {
        console.error('Error creating project:', error);
      }

      setInputField(false);
      setButtonShow(true);
      event.target.value = '';
    }
};
const combinedList = [...inputValues, ...issuesList];

  return (
    <>
    
    {/* <h1>{project_id}</h1>  {inputValues.length ? 'solid-box' : 'dotted-box'}*/}
    <div className={combinedList.length ? 'solid-box' : 'dotted-box'}>
        {combinedList.length === 0 ? (
          <div className="empty-message">Create issues to add to our sprint and then start sprint</div>
        ) : (
          combinedList.map((value, index) => (
            <div key={index} className="input-item" >
              <div className='issueType'>
                <img src={getIssueIcon(value.IssueType || 'Story')} alt={value.IssueType || 'Story'} className="issue-icon" width='20px' height='20px' />
                <div className='value'>{value.IssueName}</div>
              </div>
              
              <div className="right">
                <IssueStatus issueName={value} pid={projectid} />
              </div>
              <img src="/assignee.jpg" alt="assignee" id="userIcon" width='20px' height='20px'/>
            </div>
          ))
        )}
      </div>
      <div className="create-issue">
        {buttonShow && <button onClick={showInputField}>Create Issue</button>}
        {InputField && (
          <div className="issueCreation">
            <IssueType onSelect={setSelectedIssueType}/>
            <input type="text" className="EnterIssue" placeholder="type your issue here" onKeyDown={handleKeyPress} />
          </div>
        )}
      </div>
      
    </>
  );
}



export default connect( null,{ addIssue })(Backlog); // Connect the component to the Redux store and add the addIssue action
