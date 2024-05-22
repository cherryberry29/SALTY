import React, { useState } from 'react';

import './css/IssueType.css'; // Import CSS file for styling

export default function IssueType() {
  const [selectedOption, setSelectedOption] = useState('');

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const renderIcon = () => {
    switch (selectedOption) {
      case 'story':
        return <img src="/story.jpg" alt="Story" />;
      case 'bug':
        return <img src="/bug.jpg" alt="Bug" />;
      case 'task':
        return <img src="/task.jpg" alt="Task" />;
      default:
        return null;
    }
  };

  return (
    <div className="issue-type-dropdown">
      <select value={selectedOption} onChange={handleChange}>
        <option value="">Select Type</option>
        <option value="story">Story</option>
        <option value="bug">Bug</option>
        <option value="task">Task</option>
      </select>
      <div className="icon-container">
        {renderIcon()}
      </div>
    </div>
  );
}
