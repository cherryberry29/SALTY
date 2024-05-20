import React from 'react';

const DisplayIssueFilters = ({ data }) => {
  return (
    <div>
      <h1>Filtered Issues</h1>
      {Array.isArray(data) && data.length > 0 ? (
        data.map(item => (
          <div key={item.issue_id} className="issue-card">
            <h3>{item.IssueName}</h3>
            <p><strong>Type:</strong> {item.IssueType}</p>
            <p><strong>Description:</strong> {item.description}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Assigned to:</strong> {item.assignee}</p>
            <p><strong>Assigned by:</strong> {item.assigned_by}</p>
            {item.assigned_epic_id && <p><strong>Epic:</strong> {item.assigned_epic_id}</p>}
            {item.sprint_id && <p><strong>Sprint:</strong> {item.sprint_id}</p>}
            <p><strong>Project ID:</strong> {item.projectId_id}</p>
            {item.file_field && (
              <p>
                <strong>File:</strong> <a href={`/path/to/files/${item.file_field}`}>{item.file_field}</a>
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No issues found</p>
      )}
    </div>
  );
};

export default DisplayIssueFilters;
