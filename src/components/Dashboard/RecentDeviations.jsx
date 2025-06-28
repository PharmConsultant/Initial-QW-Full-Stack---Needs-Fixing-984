import React from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

function RecentDeviations() {
  const recentDeviations = [
    {
      id: 'DEV-2024-001',
      title: 'Temperature Excursion in Cold Storage',
      classification: 'Major',
      status: 'Investigation',
      createdAt: new Date('2024-01-15'),
      dueDate: new Date('2024-01-18'),
      assignee: 'Sarah Johnson'
    },
    {
      id: 'DEV-2024-002',
      title: 'Documentation Discrepancy - Batch Record',
      classification: 'Minor',
      status: 'CAPA Review',
      createdAt: new Date('2024-01-14'),
      dueDate: new Date('2024-01-17'),
      assignee: 'Mike Chen'
    },
    {
      id: 'DEV-2024-003',
      title: 'Equipment Malfunction - Tablet Press #3',
      classification: 'Critical',
      status: 'Root Cause Analysis',
      createdAt: new Date('2024-01-13'),
      dueDate: new Date('2024-01-16'),
      assignee: 'Jennifer Smith'
    },
    {
      id: 'DEV-2024-004',
      title: 'Cleaning Validation Failure',
      classification: 'Major',
      status: 'Completed',
      createdAt: new Date('2024-01-10'),
      dueDate: new Date('2024-01-13'),
      assignee: 'David Wilson'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return { icon: FiCheckCircle, color: 'text-green-500' };
      case 'Investigation':
      case 'Root Cause Analysis':
        return { icon: FiClock, color: 'text-yellow-500' };
      default:
        return { icon: FiAlertCircle, color: 'text-red-500' };
    }
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Major':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Minor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Deviations</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {recentDeviations.map((deviation, index) => {
          const statusConfig = getStatusIcon(deviation.status);
          const Icon = statusConfig.icon;

          return (
            <motion.div
              key={deviation.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 flex-1">
                <Icon className={`w-5 h-5 ${statusConfig.color}`} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900 truncate">
                      {deviation.id}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getClassificationColor(deviation.classification)}`}>
                      {deviation.classification}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mb-1">
                    {deviation.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    Assigned to {deviation.assignee} • Due {format(deviation.dueDate, 'MMM dd')}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {deviation.status}
                </p>
                <p className="text-xs text-gray-500">
                  {format(deviation.createdAt, 'MMM dd, yyyy')}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentDeviations;