import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../actions/auth';

import './css/create_project.css';

const Project = ({ isAuthenticated, user, createProject, project }) => {
    const [showForm, setShowForm] = useState(false);
    const [projectName, setProjectName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProject({ projectname: projectName, teamlead: user.email });
            setProjectName('');
            setShowForm(false);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    // Listen for changes in the project prop
    useEffect(() => {
        if (project && project.projectid) {
            // If project prop has been updated with projectid, navigate to the new project
            navigate(`/project/${project.projectid}`);
        }
    }, [project, navigate]);

    return (
        <div>
           
            {!showForm && (
                <button className="create-project-button" onClick={() => setShowForm(true)}>Create Project</button>
            )}
            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowForm(false)}>&times;</span>
                        <form onSubmit={handleSubmit} className="project-form">
                            <label htmlFor="projectName">Project Name:</label>
                            <input
                                type="text"
                                id="projectName"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                            <button type="submit">Create Project</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    project: state.auth.project
});

export default connect(mapStateToProps, { createProject })(Project);
