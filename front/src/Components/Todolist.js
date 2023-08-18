import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { Line } from 'react-chartjs-2';
import 'chart.js';
import 'chart.js/auto';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from './AuthContext.js';
import { API_URL } from '../config.js';
import EditModal from './EditModal';



const TodoList = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [shortDescription, setShortDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [priority, setPriority] = useState('Important');
  const [assignedBy, setAssignedBy] = useState('');
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const taskCounts = tasks.reduce((counts, task) => {
    const dateParts = task.deadline.split('-'); // Split date string by hyphens
    const month = parseInt(dateParts[1], 10); // Extract the month part
    counts[month] = (counts[month] || 0) + 1;
    return counts;
  }, Array(12).fill(0));

  const chartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Number of Tasks',
        data: taskCounts,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/tasks`, {
          withCredentials: true,
        });

        if (response.status === 401) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setTasks(response.data);
        }
      } catch (error) {
        setError('Error fetching tasks: ' + error.message);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!shortDescription || !longDescription || !deadline || !priority || !assignedBy) {
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
    if (!date || isNaN(new Date(date))) {
      return '';
    }
    
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const day = parsedDate.getDate();
    
    return `${year}-${month}-${day}`;
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

  const handleEditTask = (task) => {
    console.log("Original Task Deadline:", task.deadline);
    setIsEditing(true);
    setEditTask(task);
    setShortDescription(task.shortDescription);
    setLongDescription(task.longDescription);
    if (task.deadline) {
      try {
        const convertedDeadline = new Date(task.deadline);
        setDeadline(convertedDeadline); // Convert the deadline to a Date object
        console.log("Converted Deadline:", convertedDeadline);
        setPriority(task.priority);
        setAssignedBy(task.assignedBy);
      } catch (error) {
        console.error("Error parsing deadline:", error);
        setDeadline(null);
      }
    }
  };
  

  const updateTask = async (updatedTask) => {
    try {
      await axios.put(`${API_URL}/tasks/${updatedTask._id}`, updatedTask, {
        withCredentials: true,
      });

      const response = await axios.get(`${API_URL}/tasks`, {
        withCredentials: true,
      });
      setTasks(response.data);
    } catch (error) {
      setError('Error updating task: ' + error.message);
    }
  };

  const filterTasks = (filter) => {
    setActiveFilter(filter);
  };
     return (
    <div className="container">
      <h2 className="mt-4">Todo List</h2>

      {isAuthenticated ? (
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
                          selected={deadline ? (deadline) : null}
                          onChange={(date) => setDeadline((date))}
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
                    <div className="d-grid gap-2">
                      <button onClick={addTask} className="btn btn-primary">
                        Add Task
                      </button>
                    </div>
                    <div className="my-2 d-flex" style={{ width: '100%' }}>
                      <div className="btn-group-sm d-flex" style={{ gap: '10px', width: '100%' }}>
                        <button
                          type="button"
                          className={`btn btn btn-outline-primary${activeFilter === '' ? ' active' : ''}`}
                          onClick={() => filterTasks('')}
                          style={{ flex: 1 }}
                        >
                          All tasks ({tasks.length})
                        </button>
                        <button
                          type="button"
                          className={`btn btn btn-outline-primary${activeFilter === 'Urgent' ? ' active' : ''}`}
                          onClick={() => filterTasks('Urgent')}
                          style={{ flex: 1 }}
                        >
                          Urgent tasks ({tasks.filter(task => task.priority === 'Urgent').length})
                        </button>
                        <button
                          type="button"
                          className={`btn btn btn-outline-primary${activeFilter === 'Not Urgent' ? ' active' : ''}`}
                          onClick={() => filterTasks('Not Urgent')}
                          style={{ flex: 1 }}
                        >
                          Not Urgent tasks ({tasks.filter(task => task.priority === 'Not Urgent').length})
                        </button>
                        <button
                          type="button"
                          className={`btn btn btn-outline-primary${activeFilter === 'Important' ? ' active' : ''}`}
                          onClick={() => filterTasks('Important')}
                          style={{ flex: 1 }}
                        >
                          Important tasks ({tasks.filter(task => task.priority === 'Important').length})
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            {error && <div className="alert alert-danger">{error}</div>}
          </div>
          <div className="col-md-6">
            <div className="chart-container" style={{ position: 'relative', height: '400px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-info">
          Please sign in/register to view/add tasks.
        </div>
      )}

      {isAuthenticated && (
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
                          onClick={() => handleEditTask(task)}
                          className="btn btn-secondary"
                        >
                          Edit
                        </button>
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
      )}

      {isEditing && (
        <EditModal
          task={editTask}
          updateTask={updateTask}
          closeModal={() => {
            setIsEditing(false);
            setEditTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TodoList;
