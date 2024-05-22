import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import './css/DIF.css';

const DisplayIssueFilters = ({ data , user }) => {
  const [issue, setIssue] = useState(data);
  const [isEditing, setIsEditing] = useState(false);
  const [assigneeOptions, setAssigneeOptions] = useState([]);
  const [sprintOptions, setSprintOptions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(issue.projectId_id);

  useEffect(() => {
    setIssue(data);
  }, [data]);

  useEffect(() => {
    const fetchTeamMembersAndSprints = async () => {
      try {
        const teamMembersResponse = await axios.get(`http://localhost:8000/djapp/get_team_members/?projectid=${selectedProject}`);
        setAssigneeOptions(teamMembersResponse.data.team_members);
        
        const sprintsResponse = await axios.get(`http://localhost:8000/djapp/get_sprints/?projectid=${selectedProject}`);
        setSprintOptions(sprintsResponse.data.sprint_in_project);
      } catch (error) {
        console.error('Error fetching team members and sprints:', error);
      }
    };

    if (selectedProject) {
      fetchTeamMembersAndSprints();
    }
  }, [selectedProject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIssue(prevIssue => ({
      ...prevIssue,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await axios.post(`http://localhost:8000/djapp/update_issue/`, issue);
      setIsEditing(false);
    } catch (error) {
      console.error("There was an error updating the issue!", error);
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

  return (
    <div>
      {issue ? (
        <div className="issue-card">
          <h1>{issue.IssueName}</h1>
          <p>
            <strong>Assigned by:</strong> {issue.assigned_by}
          </p>
          <p>
            <strong>Type:</strong>
            {isEditing ? (
              <select name="IssueType" value={issue.IssueType} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="Story">Story</option>
                <option value="Task">Task</option>
                <option value="Bug">Bug</option>
                <option value="Epic">Epic</option>
              </select>
            ) : (
              issue.IssueType
            )}
          </p>
          <p>
            <strong>Description:</strong>
            {isEditing ? (
              <textarea name="description" value={issue.description} onChange={handleChange} />
            ) : (
              issue.description
            )}
          </p>
          <p>
            <strong>Status:</strong>
            {isEditing ? (
              <select name="status" value={issue.status} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="to_do">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            ) : (
              issue.status
            )}
          </p>
          <p>
            <strong>Assigned to:</strong>
            {isEditing ? (
              <select name="assignee" value={issue.assignee} onChange={handleChange}>
                <option value="">Select...</option>
                {assigneeOptions.map(user => (
                  <option key={user.email} value={user.email}>
                    {`${user.first_name} ${user.last_name}`}
                  </option>
                ))}
              </select>
            ) : (
              issue.assignee
            )}
          </p>
          {issue.assigned_epic_id && (
            <p>
              <strong>Epic:</strong>
              {isEditing ? (
                <input name="assigned_epic_id" value={issue.assigned_epic_id} onChange={handleChange} />
              ) : (
                issue.assigned_epic_id
              )}
            </p>
          )}
          {issue.sprint_id && (
            <p>
              <strong>Sprint:</strong>
              {isEditing ? (
                <select name="sprint_id" value={issue.sprint_id} onChange={handleChange}>
                  <option value="">Select...</option>
                  {sprintOptions.map(sprint => (
                    <option key={sprint.id} value={sprint.id}>
                      {sprint.name}
                    </option>
                  ))}
                </select>
              ) : (
                issue.sprint_id
              )}
            </p>
          )}
          <p>
            <strong>Project ID:</strong>
            {isEditing ? (
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
            ) : (
              issue.projectId_id
            )}
          </p>
          {issue.file_field && (
            <p>
              <strong>File:</strong>
              {isEditing ? (
                <input name="file_field" value={issue.file_field} onChange={handleChange} />
              ) : (
                <a href={`/path/to/files/${issue.file_field}`}>{issue.file_field}</a>
              )}
            </p>
          )}
          {isEditing ? (
            <button className='buttons' onClick={handleSave}>Save</button>
          ) : (
            <button className='buttons' onClick={handleEdit}>Edit</button>
          )}
        </div>
      ) : (
        <p>No issues found</p>
      )}
    </div>
  );
};
const mapStateToProps = state => ({
  user: state.auth.user // Assuming the user information is stored in the 'auth' slice of the Redux state
});

export default connect(mapStateToProps)(DisplayIssueFilters);
