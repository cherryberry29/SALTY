import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CreateIssueForm.css';
import Scroll from '../components/Scroll';
import { connect } from 'react-redux';

const CreateIssueForm = ({ onClose, user }) => {
  const [issueType, setIssueType] = useState('');
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState('');
  const [assignee, setAssignee] = useState('');
  const [sprint, setSprint] = useState('');
  const [epic, setEpic] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [sprintOptions, setSprintOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [epicName, setEpicName] = useState('');
  const [assignedby, setAssignedby] = useState(user.email);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (issueType !== "Epic") {
        const response = await axios.post('http://localhost:8000/djapp/create_issue/', {
          IssueType: issueType,
          IssueName: issueType,
          Sprint: sprint,
          Status: status,
          Assignee: assignee,
          Assigned_by: assignedby,
          Description: summary,
          Assigned_epic: null, // Since it's not an Epic, set Assigned_epic to null
          ProjectId: selectedProject,
        });
        onClose();
      } else {
        const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
        const formattedDueDate = new Date(dueDate).toISOString().split('T')[0];
        const response = await axios.post('http://localhost:8000/djapp/create_epic/', {
          epicName:epicName,
          Status: status,
          Assignee: assignee,
          Assigned_by: assignedby,
          Description: summary,
          ProjectId: selectedProject,
          StartDate: formattedStartDate,
          DueDate: formattedDueDate,
        });
        onClose(); // Close modal or perform other actions after creating an Epic
      }
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };



  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/djapp/project_list/?email=${user.email}`);
        setProjects(response.data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [user.email]);

  useEffect(() => {
    const fetchTeamMembersAndSprints = async () => {
      try {
        if (!selectedProject) return; // Don't fetch if no project is selected
        const teamMembersResponse = await axios.get(`http://localhost:8000/djapp/get_team_members/?projectid=${selectedProject}`);
        console.log(teamMembersResponse);
        setAssigneeOptions(teamMembersResponse.data.team_members);
        
        const sprintsResponse = await axios.get(`http://localhost:8000/djapp/get_sprints/?projectid=${selectedProject}`);
        console.log(sprintsResponse);
        setSprintOptions(sprintsResponse.data.sprint_in_project);
      } catch (error) {
        console.error('Error fetching team members and sprints:', error);
      }
    };

    fetchTeamMembersAndSprints();
  }, [selectedProject]);


  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit} className="create-issue-form">
      <Scroll>
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
        {issueType != "Epic" &&(<div>
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
        </div>)}
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
            <label>Epic Name:</label>
            <input
              type="text"
              value={epicName}
              onChange={(e) => setEpicName(e.target.value)}
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
