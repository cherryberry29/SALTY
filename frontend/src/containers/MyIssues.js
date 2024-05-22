import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import IssueCard from '../components/IssueCard';
import DisplayIssueFilters from './DisplayIssueFilters';

function MyIssues({ user }) {
  const [selectedProject, setSelectedProject] = useState('');
  const [projects, setProjects] = useState([]);
  const [data, setData] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('assigned_to_me');
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    if (user && user.email) {
      const fetchProjects = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/djapp/project_list/?email=${user.email}`);
          setProjects(response.data || []);
        } catch (error) {
          console.error('Error fetching projects:', error);
        }
      };

      fetchProjects();
    }
  }, [user]);

  useEffect(() => {
    if (user && user.email) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`http://localhost:8000/djapp/filters_function/`, {
            params: {
              filter: selectedFilter,
              status: '',
              projectid: selectedProject,
              currentUser: user.email
            }
          });
          console.log(response.data);
          setData(response.data);
        } catch (error) {
          console.error("There was an error fetching the data!", error);
        }
      };

      fetchData();
    }
  }, [selectedFilter, selectedProject, user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const setProjectFunction = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    setSelectedFilter(projectId !== 'allprojects' ? 'assigned_to_me' : 'allprojects');
  };

  return (
    <div className='body'>
      <div>
        <h3>All your issues</h3>
        <select className='dropdown' value={selectedProject} onChange={setProjectFunction}>
          <option value="">Choose project</option>
          <option value="allprojects">All Projects</option>
          {projects.map((project) => (
            <option key={project.projectid} value={project.projectid}>
              {project.projectname}
            </option>
          ))}
        </select>
      </div>
      <div className='display-container'>
        <div className="issue-cards-container">
          {Array.isArray(data) && data.length > 0 ? (
            data.map(item => (
              <IssueCard key={item.issue_id} issue={item} onClick={() => setSelectedIssue(item)} />
            ))
          ) : (
            <h4>No issues found</h4>
          )}
        </div>
        <div className='info-display-container'>
          {selectedIssue ? (
            <DisplayIssueFilters data={selectedIssue} />
          ) : (
            <div className="nothing-displayed">
              <h6>Select an Issue</h6>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  user: state.auth.user // Assuming the user information is stored in the 'auth' slice of the Redux state
});

export default connect(mapStateToProps)(MyIssues);
