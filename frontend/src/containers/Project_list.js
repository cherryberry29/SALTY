import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { clickProject } from '../actions/auth'; 
import './css/project_list.css';

const ProjectList = ({ user, clickProject }) => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get('http://localhost:8000/djapp/project_list/', {
                    params: { email: user.email }
                });
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, [user]);

    const handleProjectClick = (project) => {
        // Call the clickProject action when a project is clicked
        clickProject({
            projectid: project.projectid,
            projectname: project.projectname,
            teamlead_email: project.teamlead_email
        });
    };

    return (
        <div className="project-list-container">
            <h2>Projects</h2>
            <table className="project-list-table">
                <thead>
                    <tr>
                        <th>Project key</th>
                        <th>Project name</th>
                        <th>Team lead </th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.projectid} onClick={() => handleProjectClick(project)}>
                            <td>{project.projectname}</td>
                            <td>{project.projectid}</td>
                            
                            <td>{project.teamlead_email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const mapStateToProps = state => ({
    user: state.auth.user
});

// Connect the clickProject action to the component
const mapDispatchToProps = {
    clickProject
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectList);
