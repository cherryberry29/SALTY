import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import SprintForm from "./SprintForm"
import './css/sprint.css'
import { connect } from 'react-redux';
import IssueStatus from './issueStatus';
import IssueType from './issuseType';
import Backlog from './Backlog';
import axios from 'axios';
import { FaPencilAlt } from 'react-icons/fa';

// import assignee from "/assignee.png";



const Sprint = ({ sprint }) => {
  const { projectid } = useParams()
  console.log('sprintstatus', sprint.status)
  const [issues, setissues] = useState([]);
  const [buttonType, setbuttontype] = useState(sprint.status)
  useEffect(() => {
    const fetchIssues = async () => {

      try {
        const response = await axios.get("http://localhost:8000/djapp/issuesOfSprint/",
          {
            params: { projectId: projectid, sprintName: sprint.sprint }
          },
        );
        setissues(response.data);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }; fetchIssues();
  }, [projectid]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [InputField, setInputField] = useState(false);
  const [buttonShow, setbuttonShow] = useState(true);
  const [inputValues, setInputValues] = useState([]);
  const [selectedSprintData, setSelectedSprintData] = useState(null);
  const [backlogsListOpen, setBacklogsListOpen] = useState(false);

  const [showSprintform, setSprintshowform] = useState(false)
  const handleEditSprint = () => {

    setSelectedSprintData(sprint);

    setSprintshowform(true);
  };
  const handleSprintForm = async () => {
    if (buttonType == 'start') { setSprintshowform(true); }
    else {
      const allIssuesDone = issues.every(issue => issue.status === 'done');
      if (allIssuesDone) {
        const confirmComplete = window.confirm("This sprint is completed. Well done! Do you want to complete it?");
        if (confirmComplete) {
          // Show dialog to complete the sprint
        } else {
          // User canceled completing the sprint
        }
      } else {
        alert("Please complete all issues before completing the sprint.");
      }

    }


  };


  const receiveFormDataFromChild = (data) => {
    const SprintFormData = data


  };
  const toggleSprintList = () => {
    setBacklogsListOpen(!backlogsListOpen);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };
  const handleDeleteSprint = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this sprint?");
    if (confirmDelete) {
      try {
        await axios.get("http://localhost:8000/djapp/delete_sprint/",
          {
            params: { projectId: projectid, sprintName: sprint.sprint, }
          },)

        alert("Sprint deleted successfully");
        setShowDropdown(false);
      } catch (error) {
        console.error("Error deleting sprint:", error);
        alert("Failed to delete sprint");
      }
    } else {
      setShowDropdown(false);
    }
  };

  const shouldShowPencilIcon = sprint.start_date === "2003-04-25" || sprint.end_date === "2003-04-25";


  return (
    <div >
      {showSprintform && (
        <SprintForm
          closeForm={setSprintshowform}
          sendDataToParent={receiveFormDataFromChild}
          initialFormData={selectedSprintData}
          closeDropDown={setShowDropdown}
          setbuttontype={setbuttontype}
          sprintName={sprint.sprint}
        />
      )}

      <div className="mainBox">


        {/* Additional div with sprint details */}
        <div className="sprint-details">
          <div className="left-section">
          <button className="toggleBacklogsList" onClick={toggleSprintList} >
          {backlogsListOpen ? '^' : 'v'}</button>
            <div className='chotadabba1'>{sprint.sprint}</div >
            <div className='DATE'>
              <div className='chotadabba'>
                {shouldShowPencilIcon ? (
                  <div className='pencilIcon'>
                    <FaPencilAlt onClick={handleEditSprint} />
                    <p className='addDates'>Add dates</p>
                  </div>
                ) : (
                  sprint.start_date
                )}
              </div>
              <div className='chotadabba2'>
                {shouldShowPencilIcon ? '' : sprint.end_date}
              </div>
            </div>

          </div>
          <div className="right-section">
            <div>
              {issues.length > 0 && (
                <button onClick={handleSprintForm}>
                  {buttonType === 'start' ? "Start Sprint" : "Complete Sprint"}
                </button>
              )}
            </div>


            <div className="dropdown" ><button className="dropdown" onClick={toggleDropdown}>...</button></div>
            {showDropdown && (
              <div className="dropdown-Content">
                <span onClick={handleEditSprint}>Edit</span>
                <span onClick={handleDeleteSprint}>Delete</span>
              </div>
            )}
          </div>



        </div>

        {backlogsListOpen && <Backlog issuesList={issues} sprint_name={null} />}
      </div>
      {/* here i wanna pass all the  issue */}



    </div>
  );
};
const mapStateToProps = (state) => ({
  token: state.auth.access

});

export default connect(mapStateToProps)(Sprint);
