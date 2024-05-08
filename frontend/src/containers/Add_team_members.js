import React, { useState } from 'react';
import axios from 'axios';

const Add_team_members = ({ projectid }) => {
    const [email, setEmail] = useState('');

    const sendInvitation = async () => {
        try {
            const response = await axios.post('http://localhost:8000/djapp/generate_invitation_token/', { email: email, projectid: projectid });
            console.log("pressed submit emial",response.data);  // or do something else upon success
        } catch (error) {
            console.error('Error sending invitation:', error);
        }
    };

    return (
        <div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={sendInvitation}>Send Invitation</button>
        </div>
    );
};

export default Add_team_members;
