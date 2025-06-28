import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';

function ComplianceStatus() {
  const complianceMetrics = [
    {
      title: '21 CFR 210/211 Compliance',
      score: 96,
      status: 'Excellent',
      color: 'green',
      icon: FiShield
    },
    {
      title: 'ALCOA++ Data Integrity',
      score: 94,
      status: 'Good',
      color: 'green',
      icon: FiCheckCircle
    },
    {
      title: 'Investigation Timeliness',
      score: 88,
      status: 'Needs Attention',
      color: 'yellow',
      icon: FiClock
    },
    {
      title: 'CAPA Effectiveness',
      score: 92,
      status: 'Good',
      color: 'green',
      icon: FiCheckCircle
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent':
      case 'Good':
        return 'bg-green-100 text-green-800';
      case 'Needs Attention':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <FiShield className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Compliance Status</h3>
      </div>

      <div className="space-y-6">
        {complianceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          
          return (
            <motion.div
              key={metric.title}
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    {metric.title}
                  </span>
                </div>
                <span className={`text-lg font-bold ${getScoreColor(metric.score)}`}>
                  {metric.score}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${
                    metric.score >= 95 ? 'bg-green-500' :
                    metric.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.score}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                  {metric.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <FiAlertTriangle className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">Regulatory Alert</span>
        </div>
        <p className="text-sm text-blue-800">
          2 investigations approaching 3-day gateway deadline. 
          Review required to maintain compliance.
        </p>
      </div>
    </div>
  );
}

export default ComplianceStatus;