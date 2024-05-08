import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AcceptInvitation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');
  const projectId = searchParams.get('projectid'); // Assuming projectid is available in the URL params
  console.log("accept", token, projectId);

  const handleAcceptInvitation = async () => {
    try {
      const response = await axios.post('http://localhost:8000/djapp/verify_invitation_token/', { token: token });
      console.log('Invitation verified:', response.data);
      
      if (response.data.email) {
        // Process invitation (e.g., add user to project)
        await axios.post('http://localhost:8000/djapp/process_invitation_token/', { email: response.data.email, projectid: projectId });
        console.log('Invitation processed successfully');
      } else {
        console.error('Invalid or expired invitation token');
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    }
  };

  return (
    <div>
      <h1>Accept Invitation Page</h1>
      <button onClick={handleAcceptInvitation} disabled={!token}>
        Accept Invitation
      </button>
    </div>
  );
};

export default AcceptInvitation;
