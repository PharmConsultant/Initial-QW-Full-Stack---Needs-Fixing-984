import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApi, useAsyncAction } from '../../hooks/useApi';
import api from '../../services/api';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiPlus, FiFilter } = FiIcons;

const TaskList = () => {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  const { data: tasks, loading, refetch } = useApi(() => api.getTasks(), []);
  const { execute, loading: actionLoading } = useAsyncAction();

  const handleCreateTask = async (taskData) => {
    await execute(async () => {
      await api.createTask(taskData);
      refetch();
      setShowForm(false);
    });
  };

  const handleUpdateTask = async (id, updates) => {
    await execute(async () => {
      await api.updateTask(id, updates);
      refetch();
    });
  };

  const handleDeleteTask = async (id) => {
    await execute(async () => {
      await api.deleteTask(id);
      refetch();
    });
  };

  const filteredTasks = tasks?.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  }) || [];

  const filterOptions = [
    { value: 'all', label: 'All Tasks' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600 mt-1">Manage your tasks and stay organized</p>
        </div>
        
        <motion.button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <SafeIcon icon={FiPlus} className="w-5 h-5" />
          <span>New Task</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <SafeIcon icon={FiFilter} className="w-5 h-5 text-gray-500" />
        <div className="flex space-x-2">
          {filterOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === option.value
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredTasks.map(task => (
            <motion.div
              key={task.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <TaskCard
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
                loading={actionLoading}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 mt-2">Create your first task to get started!</p>
        </div>
      )}

      {/* Task Form Modal */}
      <AnimatePresence>
        {showForm && (
          <TaskForm
            onSubmit={handleCreateTask}
            onClose={() => setShowForm(false)}
            loading={actionLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;