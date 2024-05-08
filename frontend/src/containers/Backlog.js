import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import CreateIssueForm from './CreateIssueForm';

const Backlog = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectid');
  console.log(projectId);

  // State to manage form visibility
  const [formOpen, setFormOpen] = useState(false);

  // Function to open form
  const openForm = () => {
    setFormOpen(true);
  };

  // Function to close form
  const closeForm = () => {
    setFormOpen(false);
  };

  return (
    <div>
      <h1>Backlog Page</h1>
      <button onClick={openForm}>Create</button>
      {formOpen && <CreateIssueForm projectId={projectId} onClose={closeForm} />}
    </div>
  );
};

export default Backlog;
