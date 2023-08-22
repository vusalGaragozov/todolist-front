import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker'; // Import DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Import DatePicker styles
import axios from 'axios';
import {parseISO} from 'date-fns';
import { API_URL } from '../config.js';
import '../App.css';

const EditTaskModal = ({ task, onUpdate, onCancel }) => {
  const [editedShortDescription, setEditedShortDescription] = useState(task.shortDescription);
  const [editedLongDescription, setEditedLongDescription] = useState(task.longDescription);
  const [editedDeadline, setEditedDeadline] = useState(task.deadline);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [editedAssignedBy, setEditedAssignedBy] = useState(task.assignedBy);

  const parsedDeadline = typeof editedDeadline === 'string' ? parseISO(editedDeadline) : editedDeadline;

  const handleUpdate = async () => {
    const updatedTask = {
      ...task,
      shortDescription: editedShortDescription,
      longDescription: editedLongDescription,
      deadline: editedDeadline,
      priority: editedPriority,
      assignedBy: editedAssignedBy,
    };
    try {
      const response = await axios.put(`${API_URL}/tasks/${task._id}`, updatedTask, {
        withCredentials: true,
      });
      onUpdate(response.data); // Update the parent component's state with the updated task
      console.log(response.data);
    } catch (error) {
      // Handle error
    }
  };
  

  return (
    <Modal show={true} onHide={onCancel} dialogClassName="larger-modal-dialog">
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <label htmlFor="editedShortDescription">Short Description:</label>
          <input
            type="text"
            id="editedShortDescription"
            value={editedShortDescription}
            onChange={(e) => setEditedShortDescription(e.target.value)}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="editedLongDescription">Long Description:</label>
          <input
            type="text"
            id="editedLongDescription"
            value={editedLongDescription}
            onChange={(e) => setEditedLongDescription(e.target.value)}
            className="form-control"
          />
        </div>
        <div>
          <label htmlFor="editedDeadline">Deadline:</label>
          <div><DatePicker
            selected={parsedDeadline}
            onChange={(date) => setEditedDeadline(date)}
            className="form-control"
          /></div>
        </div>
        <div>
          <label htmlFor="editedPriority">Priority:</label>
          <select
            id="editedPriority"
            value={editedPriority}
            onChange={(e) => setEditedPriority(e.target.value)}
            className="form-select"
          >
            <option>Important</option>
            <option>Urgent</option>
            <option>Not Urgent</option>
          </select>
        </div>
        <div>
          <label htmlFor="editedAssignedBy">Assigned By:</label>
          <input
            type="text"
            id="editedAssignedBy"
            value={editedAssignedBy}
            onChange={(e) => setEditedAssignedBy(e.target.value)}
            className="form-control"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUpdate}>
          Update Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditTaskModal;
