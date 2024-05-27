import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/sprintform.css';
import { useParams } from 'react-router-dom';

const SprintForm = ({ closeForm, sendDataToParent, initialFormData, closeDropDown,setbuttontype ,sprintName}) => {
  const { projectid } = useParams();

  const [formData, setFormData] = useState(
    initialFormData || {
      sprint: sprintName,
      start_date: '',
      end_date: '',
      sprint_goal: '',
      project: projectid,
      status:'complete'
    }
  );

  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (initialFormData) {
      const { start_date, end_date } = initialFormData;
      const start = new Date(start_date);
      const end = new Date(end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDuration(`${diffDays / 7} weeks`);
    }
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'duration') {
      setDuration(value);
      const startDate = new Date(formData.start_date);
      if (isNaN(startDate.getTime())) {
        return; // Exit if startDate is invalid
      }

      let endDate = new Date(startDate);
      if (value === '1week') {
        endDate.setDate(startDate.getDate() + 7);
      } else if (value === '2weeks') {
        endDate.setDate(startDate.getDate() + 14);
      } else if (value === '3weeks') {
        endDate.setDate(startDate.getDate() + 21);
      } else if (value === '4weeks') {
        endDate.setDate(startDate.getDate() + 28);
      }

      setFormData({
        ...formData,
        end_date: value !== 'customize' ? endDate.toISOString().split('T')[0] : formData.end_date
      });
    } else if (name === 'start_date') {
      const startDate = new Date(value);
      if (isNaN(startDate.getTime())) {
        return; // Exit if startDate is invalid
      }

      let endDate = new Date(startDate);
      if (duration === '1week') {
        endDate.setDate(startDate.getDate() + 7);
      } else if (duration === '2weeks') {
        endDate.setDate(startDate.getDate() + 14);
      } else if (duration === '3weeks') {
        endDate.setDate(startDate.getDate() + 21);
      } else if (duration === '4weeks') {
        endDate.setDate(startDate.getDate() + 28);
      }

      setFormData({
        ...formData,
        [name]: value,
        end_date: duration !== 'customize' ? endDate.toISOString().split('T')[0] : formData.end_date
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/djapp/create_sprint/', formData);
      closeForm(false);
      sendDataToParent(formData);
      setbuttontype('complete')
      console.log(formData);
      
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleClose = () => {
    closeForm(false);
    closeDropDown(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialFormData ? 'Edit Sprint' : 'Create Sprint'}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="sprintName">Sprint Name:</label>
            <input
              type="text"
              id="sprintName"
              name="sprint"
              value={formData.sprint}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="duration">Duration:</label>
            <select
              id="duration"
              name="duration"
              value={duration}
              onChange={handleChange}
              required
            >
              <option value="">Select Duration</option>
              <option value="1week">1 Week</option>
              <option value="2weeks">2 Weeks</option>
              <option value="3weeks">3 Weeks</option>
              <option value="4weeks">4 Weeks</option>
              <option value="customize">Customize</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required={duration === 'customize'}
              disabled={duration !== 'customize'}
            />
          </div>
          <div>
            <label htmlFor="goals">Goals:</label>
            <textarea
              id="goals"
              name="sprint_goal"
              value={formData.sprint_goal}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">{initialFormData ? 'Update Sprint' : 'Create Sprint'}</button>
        </form>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default SprintForm;
