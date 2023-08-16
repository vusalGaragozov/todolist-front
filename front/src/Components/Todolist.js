import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthContext.js';
import {API_URL} from "../config.js"

// const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"

const TodoList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [priority, setPriority] = useState('Important');
  const [assignedBy, setAssignedBy] = useState('');
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          withCredentials: true,
        });
        setTasks(response.data);
      } catch (error) {
        setError('Error fetching tasks: ' + error.message);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (
      !shortDescription ||
      !longDescription ||
      !deadline ||
      !priority ||
      !assignedBy
    ) {
      setError('Please fill in all the fields.');
      return;
    }

    try {
      const newTask = {
        userId: user._id,
        listNumber: tasks.length + 1,
        shortDescription,
        longDescription,
        deadline,
        priority,
        assignedBy,
      };

      await axios.post(`${API_URL}/tasks`, newTask, {
        withCredentials: true,
      });
      setError('');
      setShortDescription('');
      setLongDescription('');
      setDeadline(null);
      setPriority('Important');
      setAssignedBy('');

      const response = await axios.get(`${API_URL}/tasks`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      setError('Error adding task: ' + error.message);
    }
  };

  const formatDate = (date) => {
    const options = { day: '2-digit', month: 'short', year: '2-digit' };
    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);
    const parts = formattedDate.split(' ');
    return `${parts[0]} ${parts[1]} ${parts[2]}`;
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`, {
        withCredentials: true,
      });

      const response = await axios.get(`${API_URL}/tasks`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      setError('Error deleting task: ' + error.message);
    }
  };

  const filterTasks = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="container">
      <h2 className="mt-4">Todo List</h2>

      <div className="d-flex justify-content-end my-4"></div>

      <div className="row mb-3">
        <div className="col-md-6">
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="shortDescription" className="form-label">
                        Short Description:
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="text"
                        id="shortDescription"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="longDescription" className="form-label">
                        Long Description:
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="text"
                        id="longDescription"
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="deadline" className="form-label">
                        Deadline:
                      </label>
                    </div>
                    <div className="col-md-8">
                      <DatePicker
                        selected={deadline}
                        onChange={(date) => setDeadline(date)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="priority" className="form-label">
                        Priority:
                      </label>
                    </div>
                    <div className="col-md-8">
                      <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="form-control"
                      >
                        <option>Important</option>
                        <option>Urgent</option>
                        <option>Not Urgent</option>
                      </select>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="row">
                    <div className="col-md-4">
                      <label htmlFor="assignedBy" className="form-label">
                        Assigned By:
                      </label>
                    </div>
                    <div className="col-md-8">
                      <input
                        type="text"
                        id="assignedBy"
                        value={assignedBy}
                        onChange={(e) => setAssignedBy(e.target.value)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <button onClick={addTask} className="btn btn-primary">
                    Add Task
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {error && <div className="alert alert-danger">{error}</div>}
        </div>
        <div className="col-md-6">
          <div className="summary-container">
            <div
              className={`summary-item${activeFilter === '' ? ' active' : ''}`}
              onClick={() => filterTasks('')}
            >
              <span className="summary-label">All tasks:</span>
              <span className="summary-count">{tasks.length}</span>
            </div>
            <div
              className={`summary-item${activeFilter === 'Urgent' ? ' active' : ''}`}
              onClick={() => filterTasks('Urgent')}
            >
              <span className="summary-label">Urgent tasks:</span>
              <span className="summary-count">
                {tasks.filter((task) => task.priority === 'Urgent').length}
              </span>
            </div>
            <div
              className={`summary-item${activeFilter === 'Not Urgent' ? ' active' : ''}`}
              onClick={() => filterTasks('Not Urgent')}
            >
              <span className="summary-label">Not Urgent tasks:</span>
              <span className="summary-count">
                {tasks.filter((task) => task.priority === 'Not Urgent').length}
              </span>
            </div>
            <div
              className={`summary-item${activeFilter === 'Important' ? ' active' : ''}`}
              onClick={() => filterTasks('Important')}
            >
              <span className="summary-label">Important tasks:</span>
              <span className="summary-count">
                {tasks.filter((task) => task.priority === 'Important').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <table className="table table-striped">
            <thead>
              <tr>
                <th style={{ width: '5%' }}>#</th>
                <th style={{ width: '15%' }}>Short Description</th>
                <th style={{ width: '35%' }}>Long Description</th>
                <th style={{ width: '10%' }}>Deadline</th>
                <th style={{ width: '10%' }}>Priority</th>
                <th style={{ width: '15%' }}>Assigned to</th>
                <th style={{ width: '10%' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter((task) => (activeFilter ? task.priority === activeFilter : true))
                .map((task, index) => (
                  <tr key={task._id}>
                    <td>{index + 1}</td>
                    <td>{task.shortDescription}</td>
                    <td>{task.longDescription}</td>
                    <td>{formatDate(task.deadline)}</td>
                    <td>{task.priority}</td>
                    <td>{task.assignedBy}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
