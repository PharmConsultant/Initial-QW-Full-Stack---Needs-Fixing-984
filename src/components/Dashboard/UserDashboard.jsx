import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiClipboard, FiClock, FiCheckCircle, FiAlertTriangle, FiUser, FiTrendingUp, FiFileText } from 'react-icons/fi';
import StatsCard from './StatsCard';
import RecentDeviations from './RecentDeviations';

function UserDashboard({ userRole = 'QA Investigator' }) {
  // Role-specific configurations
  const getRoleConfig = (role) => {
    switch (role) {
      case 'QA Investigator':
        return {
          title: 'QA Investigation Dashboard',
          subtitle: 'Your assigned investigations and quality tasks',
          primaryColor: 'blue',
          tasks: [
            'Complete DEV-2024-001 root cause analysis',
            'Review CAPA effectiveness for DEV-2023-045',
            'Submit quarterly trending report',
            'Conduct investigator training session'
          ]
        };
      case 'Production Supervisor':
        return {
          title: 'Production Oversight Dashboard',
          subtitle: 'Production-related deviations and containment actions',
          primaryColor: 'green',
          tasks: [
            'Implement containment for DEV-2024-002',
            'Review batch record discrepancies',
            'Update SOPs based on CAPA actions',
            'Schedule operator retraining'
          ]
        };
      case 'QA Manager':
        return {
          title: 'QA Management Dashboard',
          subtitle: 'Investigation oversight and approval workflows',
          primaryColor: 'purple',
          tasks: [
            'Approve 3 pending investigation reports',
            'Review monthly quality metrics',
            'Conduct regulatory readiness assessment',
            'Update investigation procedures'
          ]
        };
      default:
        return {
          title: 'User Dashboard',
          subtitle: 'Your personalized workspace',
          primaryColor: 'blue',
          tasks: []
        };
    }
  };

  const roleConfig = getRoleConfig(userRole);

  const userStats = [
    {
      title: 'My Open Tasks',
      value: 8,
      icon: FiClipboard,
      color: roleConfig.primaryColor,
      change: '+2 this week',
      trend: 'up'
    },
    {
      title: 'Pending Reviews',
      value: 3,
      icon: FiClock,
      color: 'yellow',
      change: '-1 from yesterday',
      trend: 'down'
    },
    {
      title: 'Completed This Month',
      value: 12,
      icon: FiCheckCircle,
      color: 'green',
      change: '+4 vs last month',
      trend: 'up'
    },
    {
      title: 'Quality Score',
      value: '91%',
      icon: FiTrendingUp,
      color: 'green',
      change: '+2% improvement',
      trend: 'up'
    }
  ];

  const myInvestigations = [
    {
      id: 'DEV-2024-001',
      title: 'Temperature Excursion - Cold Storage',
      status: 'Evaluation',
      priority: 'High',
      dueDate: '2024-01-18',
      qualityScore: 85
    },
    {
      id: 'DEV-2024-002',
      title: 'Documentation Discrepancy',
      status: 'Disposition Review',
      priority: 'Medium',
      dueDate: '2024-01-20',
      qualityScore: 92
    },
    {
      id: 'DEV-2024-003',
      title: 'Equipment Malfunction',
      status: 'Initiated',
      priority: 'Critical',
      dueDate: '2024-01-16',
      qualityScore: 72
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Initiated': return 'bg-blue-100 text-blue-800';
      case 'Evaluation': return 'bg-yellow-100 text-yellow-800';
      case 'Disposition Review': return 'bg-orange-100 text-orange-800';
      case 'Approval': return 'bg-purple-100 text-purple-800';
      case 'Closure': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {roleConfig.title}
            </h1>
            <p className="text-gray-600 mt-2">
              {roleConfig.subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{userRole}</span>
            </div>
            <Link
              to="/investigation"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiClipboard className="w-5 h-5" />
              <span>New Investigation</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Investigations */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">My Investigations</h3>
              <Link
                to="/investigations"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {myInvestigations.map((investigation, index) => (
                <motion.div
                  key={investigation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className={`w-3 h-3 rounded-full ${
                      investigation.priority === 'Critical' 
                        ? 'bg-red-500' 
                        : investigation.priority === 'High' 
                        ? 'bg-orange-500' 
                        : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-gray-900">
                          {investigation.id}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          investigation.qualityScore >= 90 
                            ? 'bg-green-100 text-green-800'
                            : investigation.qualityScore >= 80 
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Quality: {investigation.qualityScore}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {investigation.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        Due: {investigation.dueDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(investigation.status)}`}>
                      {investigation.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {investigation.priority} Priority
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiFileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Today's Tasks</h3>
            </div>
            
            <div className="space-y-3">
              {roleConfig.tasks.map((task, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{task}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quality Insights */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiTrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Quality Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiCheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Strengths</span>
            </div>
            <p className="text-sm text-green-800">
              Excellent timeline compliance and thorough documentation
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Areas for Improvement</span>
            </div>
            <p className="text-sm text-yellow-800">
              Consider more comprehensive root cause analysis techniques
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiTrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Recommendations</span>
            </div>
            <p className="text-sm text-blue-800">
              Attend advanced investigation methodology training
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserDashboard;