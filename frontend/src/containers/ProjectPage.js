import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Add_team_members from './Add_team_members';

const ProjectPage = () => {
  const { projectid } = useParams();
  return (
    <div>
      <h1>
        projct page
      </h1>
      <p>Project ID: {projectid}</p>
      <Add_team_members projectid={projectid} />
    </div>
  );
};

export default ProjectPage;
