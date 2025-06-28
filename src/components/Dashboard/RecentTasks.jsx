import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiClock, FiCheckCircle, FiAlertCircle } = FiIcons;

const RecentTasks = ({ tasks }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: FiCheckCircle, color: 'text-green-500' };
      case 'in-progress':
        return { icon: FiClock, color: 'text-yellow-500' };
      default:
        return { icon: FiAlertCircle, color: 'text-gray-500' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Tasks</h3>
      
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No tasks yet. Create your first task!</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task, index) => {
            const statusConfig = getStatusIcon(task.status);
            
            return (
              <motion.div
                key={task.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <SafeIcon 
                    icon={statusConfig.icon} 
                    className={`w-5 h-5 ${statusConfig.color}`} 
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500">
                      Created {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTasks;