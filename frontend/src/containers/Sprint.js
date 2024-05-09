import React, { useState , useEffect} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import CreateIssueForm from './CreateIssueForm';
import './css/sprint.css'
import { connect } from 'react-redux'; 
import IssueStatus from './issueStatus';
import IssueType from './issuseType';
import Backlog from './Backlog';
import axios from 'axios';



const Sprint = ({token}) => {
 const {projectid}=useParams()
 console.log(token)
 const [issues, setissues] = useState([]);

  useEffect(() => {
    const fetchIssues = async () => {
      
      try {
        const response = await axios.get("http://localhost:8000/djapp/issues/", {
          params: {
            projectId: projectid 
          },
        });
        console.log(response)
        setissues(response.data);
        console.log(issues) 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    

    fetchIssues(); // Fetch issues when component mounts
  }, [projectid]); 

  
  const [formOpen, setFormOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [InputField, setInputField] = useState(false);
  const [buttonShow, setbuttonShow] = useState(true);
  const [inputValues, setInputValues] = useState([]);

 
  const openForm = () => {
    setFormOpen(true);
  };

  // Function to close form
  const closeForm = () => {
    setFormOpen(false);
  };
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown); 
  };
  
  console.log("hereee")
 console.log(showDropdown)

  return (
    <>
    <div>
      <h1>Backlog Page</h1>
      <button onClick={openForm}>Create</button>
      {formOpen && <CreateIssueForm projectId={projectid} onClose={closeForm} />}
    </div>
    <div className="mainBox">
      
      
      {/* Additional div with sprint details */}
      <div className="sprint-details">
        <div className="left-section">
          <div className='chotadabba1'>Sprint Name</div >
          <div className='chotadabba'>Start Date</div >
          <div className='chotadabba2'>End Date</div >
        </div>
        <div className="right-section">
          <div>
          <button  >Complete Sprint</button></div>
          
            
            <div className="dropdown" onClick={toggleDropdown}>...</div>
            </div>
            
            {showDropdown && (
              <div className="dropdown-content">
                <span>Edit</span>
                <span>Delete</span>
              </div>
            )}
          
        </div>
     

        {/* here i wanna pass filtered issue */}
      <Backlog /> 
      </div>
      {/* here i wanna pass all the  issue */}
    <Backlog />
    </>
  );
};
const mapStateToProps = (state) => ({
  token:state.auth.access
   
 });

 export default connect(mapStateToProps)(Sprint);
