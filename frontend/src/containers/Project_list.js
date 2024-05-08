// ProjectList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';

const ProjectList = ({ user }) => {
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

    return (
        <div>
            <h1>Project List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Team Lead Email</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.projectid}>
                            <td>{project.projectid}</td>
                            <td>{project.projectname}</td>
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

export default connect(mapStateToProps)(ProjectList);
