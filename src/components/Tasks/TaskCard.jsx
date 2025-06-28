import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiCircle } = FiIcons;

const TaskCard = ({ task, onUpdate, onDelete, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: FiCheckCircle, color: 'text-green-500' };
      case 'in-progress':
        return { icon: FiClock, color: 'text-yellow-500' };
      default:
        return { icon: FiCircle, color: 'text-gray-400' };
    }
  };

  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' 
      ? 'todo' 
      : task.status === 'todo' 
      ? 'in-progress' 
      : 'completed';
    onUpdate(task.id, { status: newStatus });
  };

  const handleSave = () => {
    onUpdate(task.id, { title, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setIsEditing(false);
  };

  const statusConfig = getStatusIcon(task.status);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-4">
        <button
          onClick={handleStatusToggle}
          disabled={loading}
          className="flex-shrink-0 mr-3 mt-1"
        >
          <SafeIcon
            icon={statusConfig.icon}
            className={`w-5 h-5 ${statusConfig.color} hover:scale-110 transition-transform`}
          />
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-lg font-semibold text-gray-900 bg-transparent border-b border-gray-300 focus:border-primary-500 outline-none"
              autoFocus
            />
          ) : (
            <h3 className={`text-lg font-semibold ${
              task.status === 'completed' 
                ? 'text-gray-500 line-through' 
                : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiEdit2} className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <SafeIcon icon={FiTrash2} className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mb-4">
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-gray-600 bg-transparent border border-gray-300 rounded-md p-2 focus:border-primary-500 outline-none resize-none"
            rows="3"
          />
        ) : (
          <p className="text-gray-600 text-sm line-clamp-3">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
          {task.priority} priority
        </span>
        <span className="text-xs text-gray-500">
          {format(new Date(task.createdAt), 'MMM dd')}
        </span>
      </div>

      {isEditing && (
        <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-3 py-1 bg-primary-500 text-white text-sm rounded-md hover:bg-primary-600 transition-colors"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard;