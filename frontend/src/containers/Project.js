import React, { useState , useEffect} from 'react';
import {Link} from "react-router-dom"
import Create_project from './Create_project';
import Project_list from './Project_list';
import './css/project.css';


const Home = () => {



  return (
    <div className='project'>
     <Create_project />
     <Project_list/>

    </div>
  )
}

export default Home
