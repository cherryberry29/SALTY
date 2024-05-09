import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../actions/auth';
import './css/create_project.css';

const Project = ({ isAuthenticated, user, createProject, project }) => {
    const [showForm, setShowForm] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectId, setProjectId] = useState('');
    const navigate = useNavigate();

    const generateProjectId = (name) => {
        let code;
        if (!name.includes(' ')) {
            code = name.slice(0, 4).toUpperCase();
        } else {
            const words = name.split(/\s+/);
            code = (words[0].slice(0, 3) + words[words.length - 1].slice(0, 3)).toUpperCase();
        }

        if (!/^[A-Za-z]+$/.test(code)) {
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            code = Array.from({ length: 4 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');
        }

        return code;
    };

    const handleProjectNameChange = (e) => {
        const newName = e.target.value;
        setProjectName(newName);
        const newProjectId = newName.trim() ? generateProjectId(newName) : ''; 
        setProjectId(newProjectId);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createProject({ projectname: projectName, projectid: projectId, teamlead: user.email });
            setProjectName('');
            setProjectId('');
            setShowForm(false);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    useEffect(() => {
        if (project && project.projectid) {
            navigate(`/project/${project.projectid}/backlog`);
        }
    }, [project, navigate]);

    return (
        <span className='create-project'>
           
            {!showForm && (
                <button className="create-project-button" onClick={() => setShowForm(true)}>Create Project</button>
            )}
            {showForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowForm(false)}>&times;</span>
                        <form onSubmit={handleSubmit} className="project-form">
                            <h3 className="projectName">Create a Scrum project</h3>
                            <div className='project-form-inputs'>
                                <label>Enter Project name</label>
                            <input
                                type="text"
                                id="projectName"
                                value={projectName}
                                
                                onChange={handleProjectNameChange}
                                required
                            />
                            <label>Project key </label>
                            <input
                                type="text"
                                id="projectId"
                                value={projectId}
                              
                                readOnly
                                disabled
                            />
                            <button type="submit">Create Project</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </span>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user,
    project: state.auth.project
});

export default connect(mapStateToProps, { createProject })(Project);
