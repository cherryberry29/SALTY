import React, { useState } from 'react'


const Filters = () => {

  const [selectedFilter, setSelectedFilter] = useState('');
  const printFilter = () =>{
    console.log(selectedFilter);
  }

  return (
    <div>
      <h1>Filters</h1>
      <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
        <option value="">Select Filter</option>
        <option value="assignedBy">Assigned By</option>
        <option value="status">Assigned to me</option>
        <option value="status">Sprint</option>
        <option value="status">Status</option>
        <option value="status">Status</option>
        <option value="status">Status</option>
      </select>
      {printFilter()}
      

    
    </div>
  )
}

export default Filters
