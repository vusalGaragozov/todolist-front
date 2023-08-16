import React from 'react';


const Summary = ({ tasks }) => {
  // Calculate the count of urgent tasks
  const urgentTasksCount = tasks.filter(task => task.priority === 'Urgent').length;

  return (
    <div className="summary">
      <h3>Summary</h3>
      <p>Urgent tasks: {urgentTasksCount}</p>
      {/* Add more summary information as needed */}
    </div>
  );
};

export default Summary;
