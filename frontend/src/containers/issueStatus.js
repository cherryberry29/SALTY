import React, { useState } from 'react';
import axios from 'axios';

export default function IssueStatus({ issueName ,pid}) {
  const [selectedStatus, setSelectedStatus] = useState(issueName.status);
console.log("issuestaus",issueName)
  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    
    try {
      await axios.post('http://localhost:8000/djapp/update_issueStatus/', { issue:issueName.IssueName ,status: newStatus,projectId:pid});    } catch (error) {
      console.error('Error updating issue status:', error);
    }
  };

  return (
    <div>
      <select id="status" value={selectedStatus} onChange={handleStatusChange}>
        <option value="toDo">To Do</option>
        <option value="inProgress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}
