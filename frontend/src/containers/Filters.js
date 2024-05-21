import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import IssueCard from '../components/IssueCard';
import DisplayIssueFilters from './DisplayIssueFilters';
import './css/FiltersCss.css';

const Filters = ({ isAuthenticated, user }) => {
  const { projectid } = useParams();
  const [selectedFilter, setSelectedFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [data, setData] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      setCurrentUser(user.email);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/djapp/filters_function/`, {
          params: {
            filter: selectedFilter,
            status: selectedFilter === 'Status' ? statusFilter : '',
            projectid: projectid,
            currentUser: currentUser
          }
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    fetchData();
  }, [selectedFilter, statusFilter, projectid, currentUser]);

  return (
    <div>
      <h1>Filters</h1>
      <select
        value={selectedFilter}
        onChange={(e) => {
          setSelectedFilter(e.target.value);
          if (e.target.value !== 'Status') {
            setStatusFilter('');
          }
        }}
      >
        <option value="">Select Filter</option>
        <option value="all_issues">All issues</option>
        <option value="assigned_to_me">Assigned to me</option>
        <option value="Status">Status</option>
        <option value="unassigned">Unassigned</option>
        <option value="epics">Epics</option>
      </select>

      {selectedFilter === 'Status' && (
        <div>
          <h5>Status</h5>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Select Status</option>
            <option value="to_do">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      )}
      <div className='display-container'>
        <div className="issue-cards-container">
          {Array.isArray(data) && data.length > 0 ? (
            data.map(item => (
              <IssueCard key={item.issue_id} issue={item} onClick={setSelectedIssue} />
            ))
          ) : (
            <h1>No issues found</h1>
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
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Filters);
