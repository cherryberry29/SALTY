import React from 'react'
import {Link} from "react-router-dom"
import Create_project from './Create_project';
import Project_list from './Project_list';


const Home = () => {
  return (
    <div>
     Projects
     <Create_project />
     <Project_list/>

    </div>
  )
}

export default Home
