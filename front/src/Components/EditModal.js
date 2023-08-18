import React, { useState } from 'react';
import DatePicker from 'react-datepicker';


const EditModal = ({ task, updateTask, closeModal }) => {
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleUpdate = () => {
    updateTask(editedTask);
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Task</h5>
            <button type="button" className="btn-close" onClick={closeModal}></button>
          </div>
          <div className="modal-body">
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
                  value={editedTask.shortDescription}
                  onChange={(e) => setEditedTask({ ...editedTask, shortDescription: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
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
                  value={editedTask.longDescription}
                  onChange={(e) => setEditedTask({ ...editedTask, longDescription: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="deadline" className="form-label">
                  Deadline:
                </label>
              </div>
              <div className="col-md-8">
                <DatePicker
                  selected={editedTask.deadline}
                  onChange={(date) => setEditedTask({ ...editedTask, deadline: date })}
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label htmlFor="priority" className="form-label">
                  Priority:
                </label>
              </div>
              <div className="col-md-8">
                <select
                  id="priority"
                  value={editedTask.priority}
                  onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value })}
                  className="form-control"
                >
                  <option>Important</option>
                  <option>Urgent</option>
                  <option>Not Urgent</option>
                </select>
              </div>
            </div>
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
                  value={editedTask.assignedBy}
                  onChange={(e) => setEditedTask({ ...editedTask, assignedBy: e.target.value })}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
