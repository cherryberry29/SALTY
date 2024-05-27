
import Backlog from './Backlog';
import React, { useState , useEffect} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import Sprint from './Sprint';
import IssueForm from './IssueForm';
import  "./css/DisplayBacklog.css";

export default function DisplayBacklog() {
    
    const {projectid}=useParams()
    const [sprints, setSprints] = useState([]);
    const [issues, setissues] = useState([]);
    const [formOpen, setFormOpen] = useState(false);
    const [sprintCount, setSprintCount] = useState(0); // Initially no sprints
    const [sprintCreated, setSprintCreated] = useState(false);
    const [deletedSprint,setdeletedSprint]=useState(false)
    const [backlogsListOpen, setBacklogsListOpen] = useState(false);
    
    const openForm = () => {
      setFormOpen(true);
    };
  
    // Function to close form<button onClick={openForm}>Create</button>
    const closeForm = () => {
      setFormOpen(false);
    };
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("http://localhost:8000/djapp/countsprints/", {
            params: { projectId: projectid }
          });
          const data = response.data;
          // setSprintCount(data.count);
          setSprints(data.sprints); // Assign array of sprint objects to state variable
          console.log("datadddd",data.sprints)
          console.log("sprintss",sprints)
          if (data.sprints.length > 0) {
            const lastSprint = data.sprints[data.sprints.length - 1];
            const lastSprintNumber = parseInt(lastSprint.sprint.match(/Sprint (\d+)/)[1]);
            setSprintCount(lastSprintNumber);
          } else {
            setSprintCount(0);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }; 
      fetchData(); 
    }, [deletedSprint, sprintCount]); 
      
 
    useEffect(() => {
        const fetchIssues = async () => {
          
          try {
            const response = await axios.get("http://localhost:8000/djapp/issues/", 
            {
              params: { projectId: projectid}
          },
            );
            console.log(response)
            setissues(response.data);
            console.log(issues) 
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };fetchIssues(); 
      }, [projectid]); 
    
      const handleCreateSprint = async () => {
        try {
          const sprintName = `Sprint ${sprintCount + 1}-${projectid.substring(0, 4)}`;
          
          await axios.post('http://localhost:8000/djapp/update_sprintName/', { sprintName:sprintName,projectid:projectid });
          setSprintCount(prevCount => prevCount + 1);
          setSprintCreated(true);
      } catch (error) {
          console.error("Error creating sprint:", error);
      }
    };
    const toggleBacklogsList = () => {
      setBacklogsListOpen(!backlogsListOpen);
    };
  return (
    <div className='mainContainer'>
       
    <div className='firstDiv'>
      <h1>Backlog Page</h1>
      <button onClick={openForm} className='createClass'>Create</button>
      {formOpen && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeForm}>&times;</span>
              <IssueForm onClose={closeForm} />
            </div>
          </div>
        )}
    </div>
    {sprintCount === 0 && !sprintCreated && <p>Click on "Create Sprint" to create your first sprint.</p>}
    {sprints.map((sprint, index) => (
        <Sprint key={index} sprint={sprint} />
    ))}
        
        <div className='backlogsList'>
          <div className='firstDiv'>
          <button className="toggleBacklogsList" onClick={toggleBacklogsList} >
          {backlogsListOpen ? '^' : 'v'}
        </button>
          <h3 >Backlogs</h3>
       <button className='createSprint' onClick={handleCreateSprint}>Create Sprint</button>  
       </div>
       {backlogsListOpen && <Backlog issuesList={issues} sprint_name={null} />}
      </div>
    </div>
  )
}
