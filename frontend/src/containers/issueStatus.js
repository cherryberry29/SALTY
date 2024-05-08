import React from 'react'
import "./css/issueStatus.css"

export default function IssueStatus() {
  return (
    <div>
     <select id="status">
    <option value="toDo">To Do</option>
    <option value="inProgress">In Progress</option>
    <option value="done">Done</option>
  </select>
  <div className="dropdown-arrow">&#x25B2</div>

    </div>
  )
}
