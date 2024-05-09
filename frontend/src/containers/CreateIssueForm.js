import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CreateIssueForm.css';
import Scroll from '../components/Scroll';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';



const CreateIssueForm = ({ onClose, user  }) => {
 
  const [issueType, setIssueType] = useState('');
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState('');
  const [assignee, setAssignee] = useState('');
  const [sprint, setSprint] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const { projectid } = useParams(); // Get projectid from URL
  const [sprintOptions, setSprintOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [assignedby, setAssignedby] = useState(user.email);
  

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/djapp/project_list/?email=${user.email}`);
        console.log("this is assignedby", assignedby);
        setProjects(response.data || []); // Ensure response.data is an array, or initialize as an empty array if undefined
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [user.email]);


  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // console.log("pid = ", projectid);
        const response = await axios.get(`http://localhost:8000/djapp/get_team_members/?projectid=${projectid}`);
        console.log("this is response from backend asignee", response);
        setAssigneeOptions(response.data.team_members);
        // console.log(assigneeOptions);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, [projectid]);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        // console.log("pid for sprint", projectid);
        const response_sprint = await axios.get(`http://localhost:8000/djapp/get_sprints/?projectid=${projectid}`);
        console.log("this is sprint response fron backend",response_sprint);
        setSprintOptions(response_sprint.data.sprint_in_project);
        // console.log(sprintOptions);
      }
      catch (error) {
        console.error("error fetching sprint", error);
      }
    }; fetchSprints();
  }, [projectid])




  const handleSubmit = (e) => {
    e.preventDefault();
    // Your submission logic here
  };

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (

    <form onSubmit={handleSubmit} className="create-issue-form">
      <Scroll>
        <button type="button" onClick={onClose}>X</button> {/* Close button */}
        <div>
          <label>Project:</label>
          <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
            <option value="">Select...</option>
            {projects.map((project) => (
              <option key={project.projectid} value={project.projectid}>
                {project.projectname}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Issue Type:</label>
          <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
            <option value="">Select...</option>
            <option value="Story">Story</option>
            <option value="Task">Task</option>
            <option value="Bug">Bug</option>
            <option value="Epic">Epic</option>
          </select>
        </div>
        <div>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select...</option>
            <option value="To-Do">To-Do</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label>Summary:</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div>
          <label>Assignee:</label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="">Select</option>
            {assigneeOptions && assigneeOptions.length > 0 ? (
              assigneeOptions.map(user => (
                <option key={user.email} value={user.email}>
                  {`${user.first_name} ${user.last_name}`}
                </option>
              ))
            ) : (
              <option value="" disabled>Loading...</option>
            )}
          </select>
        </div>
        <div>
          <label>Sprint:</label>
          <select>
            <option value="">Select...</option>
            {sprintOptions && sprintOptions.length > 0 ? (
              sprintOptions.map(sprint => (
                <option key={sprint.sprint} value={sprint.sprint}>
                  {sprint.sprint}
                </option>
              ))
            ) : (
              <option value="" disabled>Loading...</option>
            )}
          </select>
        </div>
        {issueType === "Epic" && (
          <div>
            <label>Start Date:</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        )}
        {issueType === "Epic" && (
          <div>
            <label>Due Date:</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        )}
        <div>
          <label>Attachment:</label>
          <input type="file" onChange={(e) => setAttachment(e.target.value)}/>
        </div>
        <div>
          <button type="submit">Create</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </Scroll>
    </form>

  );
};

const mapStateToProps = state => ({
  user: state.auth.user // Assuming the user information is stored in the 'auth' slice of the Redux state
});

export default connect(mapStateToProps)(CreateIssueForm);
