import React from 'react';

const IssueCard = ({ issue, onClick }) => {
  return (
    <div className="issue-card" onClick={() => onClick(issue)}>
      <h3>{issue.IssueName}</h3>
      <p>Type: {issue.IssueType !== "" ? issue.IssueType : "No type specified, add edit option"}</p>
    </div>
  );
};

export default IssueCard;
