import React, { useState } from 'react';
import './css/IssueType.css'; 

const IssueType = ({ onSelect }) => {
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Story');

  const toggleOptions = () => {
    setIsOptionsVisible(!isOptionsVisible);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOptionsVisible(false);
    onSelect(option); // Call the callback prop with the selected option
  };

  return (
    <div className="container">
      <div className="toggle-div" onClick={toggleOptions}>
        <img src={`/${selectedOption.toLowerCase()}.jpg`} alt={selectedOption} className="selected-icon" width='20px' height='20px'/>
        <span className="arrow">{isOptionsVisible ? '▲' : '▼'}</span>
      </div>
      {isOptionsVisible && (
        <div className="options-div">
          <div className="option" onClick={() => handleOptionClick('Story')}>
            <img src="/story.jpg" alt="Story" className="option-icon" width='20px' height='20px'/>
            <span>Story</span>
          </div>
          <div className="option" onClick={() => handleOptionClick('Bug')}>
            <img src="/bug.jpg" alt="Bug" className="option-icon" width='20px' height='20px'/>
            <span>Bug</span>
          </div>
          <div className="option" onClick={() => handleOptionClick('Task')}>
            <img src="/task.jpg" alt="Task" className="option-icon" width='20px' height='20px'/>
            <span>Task</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueType;
