import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/CreateIssueForm.css';
import Scroll from '../components/Scroll';



const CreateIssueForm = ({ projectId ,onClose }) => {
  const [project, setProject] = useState('');
  const [issueType, setIssueType] = useState('');
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState('');
  const [assignee, setAssignee] = useState('');
  const [sprint, setSprint] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeOptions, setAssigneeOptions] = useState([]);


  useEffect(() => {
    // Fetch team members from backend
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/djapp/get-team-members/?projectid=${projectId}');
        setAssigneeOptions(response.data.team_members);
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };

    fetchTeamMembers();
  }, []);


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
        <textarea
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
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
        <select value={sprint} onChange={(e) => setSprint(e.target.value)}>
          <option value="">Select...</option>
          {/* Add sprint options here */}
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
        <input type="file" onChange={handleAttachmentChange} />
      </div>
      <div>
        <button type="submit">Create</button>
        <button type="button">Cancel</button>
      </div>
      </Scroll>
    </form>
    
  );
};

export default CreateIssueForm;
