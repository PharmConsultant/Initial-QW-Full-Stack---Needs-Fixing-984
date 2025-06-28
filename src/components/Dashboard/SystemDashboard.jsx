import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiAlertTriangle, FiTrendingUp, FiUsers, FiFileText, FiCheckCircle, FiBarChart, FiActivity, FiDatabase, FiSettings } from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';
import StatsCard from './StatsCard';

function SystemDashboard() {
  const systemStats = [
    {
      title: 'Total Deviations',
      value: 156,
      icon: FiFileText,
      color: 'blue',
      change: '+12 this month',
      trend: 'up'
    },
    {
      title: 'Open Tasks',
      value: 23,
      icon: FiAlertTriangle,
      color: 'red',
      change: '+3 this week',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: 42,
      icon: FiUsers,
      color: 'purple',
      change: '+5 this week',
      trend: 'up'
    },
    {
      title: 'System Compliance',
      value: '94%',
      icon: FiCheckCircle,
      color: 'green',
      change: '+1% improvement',
      trend: 'up'
    }
  ];

  // Monthly deviation breakdown data
  const monthlyDeviationData = {
    title: {
      text: 'Total Deviations by Month',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: { type: 'value' },
    series: [{
      name: 'Deviations',
      type: 'bar',
      data: [12, 8, 15, 10, 18, 14, 22, 19, 16, 13, 11, 8],
      itemStyle: { color: '#3B82F6' }
    }]
  };

  // Open tasks by investigator
  const openTasksByInvestigator = [
    { name: 'Sarah Johnson', openTasks: 8, role: 'QA Investigator' },
    { name: 'Mike Chen', openTasks: 5, role: 'Production Supervisor' },
    { name: 'Jennifer Smith', openTasks: 4, role: 'QA Manager' },
    { name: 'David Wilson', openTasks: 3, role: 'Manufacturing Manager' },
    { name: 'Lisa Anderson', openTasks: 3, role: 'QA Investigator' }
  ];

  // Active users breakdown
  const activeUsers = [
    { name: 'Sarah Johnson', role: 'QA Investigator', numberOpen: 8, avgDaysOpen: 15, status: 'Active' },
    { name: 'Mike Chen', role: 'Production Supervisor', numberOpen: 5, avgDaysOpen: 22, status: 'Active' },
    { name: 'Jennifer Smith', role: 'QA Manager', numberOpen: 4, avgDaysOpen: 8, status: 'Active' },
    { name: 'David Wilson', role: 'Manufacturing Manager', numberOpen: 3, avgDaysOpen: 35, status: 'Active' },
    { name: 'Lisa Anderson', role: 'QA Investigator', numberOpen: 3, avgDaysOpen: 12, status: 'Active' },
    { name: 'Robert Taylor', role: 'Quality Engineer', numberOpen: 2, avgDaysOpen: 45, status: 'Active' }
  ];

  const statusBreakdown = [
    { 
      status: 'Initiated', 
      count: 8, 
      color: 'blue',
      ageBreakdown: { lessThan30: 5, between31_60: 2, greaterThan60: 1 }
    },
    { 
      status: 'Evaluation', 
      count: 6, 
      color: 'yellow',
      ageBreakdown: { lessThan30: 4, between31_60: 1, greaterThan60: 1 }
    },
    { 
      status: 'Disposition Review', 
      count: 4, 
      color: 'orange',
      ageBreakdown: { lessThan30: 2, between31_60: 2, greaterThan60: 0 }
    },
    { 
      status: 'Approval', 
      count: 3, 
      color: 'purple',
      ageBreakdown: { lessThan30: 3, between31_60: 0, greaterThan60: 0 }
    },
    { 
      status: 'Closure', 
      count: 2, 
      color: 'green',
      ageBreakdown: { lessThan30: 2, between31_60: 0, greaterThan60: 0 }
    }
  ];

  // Right First Time Status
  const rightFirstTimeData = [
    { name: 'Sarah Johnson', percentage: 92, trend: 'up', change: '+3%' },
    { name: 'Mike Chen', percentage: 88, trend: 'down', change: '-2%' },
    { name: 'Jennifer Smith', percentage: 95, trend: 'up', change: '+1%' },
    { name: 'David Wilson', percentage: 85, trend: 'up', change: '+5%' },
    { name: 'Lisa Anderson', percentage: 90, trend: 'down', change: '-1%' },
    { name: 'Robert Taylor', percentage: 87, trend: 'up', change: '+2%' }
  ];

  const qualityMetrics = [
    { category: 'Documentation Completeness', score: 92, status: 'Excellent' },
    { category: 'Timeline Compliance', score: 89, status: 'Good' },
    { category: 'Investigation Depth', score: 85, status: 'Good' },
    { category: 'CAPA Effectiveness', score: 91, status: 'Excellent' },
    { category: 'Regulatory Alignment', score: 88, status: 'Good' }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'Quality Risk',
      message: 'DEV-2024-003 has low quality score (72%) - requires review',
      severity: 'high',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      type: 'Compliance',
      message: '3 investigations approaching timeline deadline',
      severity: 'medium',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      type: 'System',
      message: 'FDA 483 database updated - 12 new citations added',
      severity: 'low',
      timestamp: '1 day ago'
    }
  ];

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
              System Administration Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Complete system overview and quality metrics
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/settings"
              className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FiSettings className="w-5 h-5" />
              <span>System Settings</span>
            </Link>
            <Link
              to="/analytics"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiBarChart className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Deviations Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ReactECharts option={monthlyDeviationData} style={{ height: '300px' }} />
        </motion.div>

        {/* Open Tasks by Investigator */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Open Tasks by Investigator</h3>
          </div>
          
          <div className="space-y-3">
            {openTasksByInvestigator.map((investigator, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">{investigator.name}</p>
                  <p className="text-xs text-gray-500">{investigator.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-600">{investigator.openTasks}</span>
                  <p className="text-xs text-gray-500">open tasks</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Active Users Table */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiUsers className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Active Users Breakdown</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number Open</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Days Open</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeUsers.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{user.numberOpen}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      user.avgDaysOpen <= 30 ? 'text-green-600' : 
                      user.avgDaysOpen <= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {user.avgDaysOpen} days
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Investigation Status Breakdown with Age Analysis */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiActivity className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Investigation Status Breakdown</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statusBreakdown.map((item, index) => (
            <div key={item.status} className="text-center">
              <div className={`w-16 h-16 rounded-full bg-${item.color}-100 flex items-center justify-center mx-auto mb-2`}>
                <span className={`text-2xl font-bold text-${item.color}-600`}>{item.count}</span>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-2">{item.status}</p>
              
              {/* Age Breakdown */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-green-600">≤30 days:</span>
                  <span className="font-medium">{item.ageBreakdown.lessThan30}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">31-60 days:</span>
                  <span className="font-medium">{item.ageBreakdown.between31_60}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">&gt;60 days:</span>
                  <span className="font-medium">{item.ageBreakdown.greaterThan60}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Right First Time Status */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiCheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Right First Time Status</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rightFirstTimeData.map((user, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                <div className="flex items-center space-x-1">
                  {user.trend === 'up' ? (
                    <FiTrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <FiTrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />
                  )}
                  <span className={`text-xs font-medium ${
                    user.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.change}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`text-2xl font-bold ${
                  user.percentage >= 90 ? 'text-green-600' : 
                  user.percentage >= 80 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {user.percentage}%
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        user.percentage >= 90 ? 'bg-green-500' : 
                        user.percentage >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${user.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Metrics */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiShield className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Quality Metrics</h3>
          </div>
          
          <div className="space-y-4">
            {qualityMetrics.map((metric, index) => (
              <div key={metric.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {metric.category}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {metric.score}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* System Alerts */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">System Alerts</h3>
          </div>
          
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.severity === 'high'
                    ? 'bg-red-50 border-red-200'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {alert.type}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {alert.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FDA Compliance Overview */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiDatabase className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">FDA Compliance</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">FDA 483 Citations</h4>
              <p className="text-2xl font-bold text-blue-600">247</p>
              <p className="text-sm text-gray-600">Last updated: Today</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Warning Letters</h4>
              <p className="text-2xl font-bold text-orange-600">89</p>
              <p className="text-sm text-gray-600">Last updated: Today</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Compliance Risk</h4>
              <p className="text-2xl font-bold text-green-600">Low</p>
              <p className="text-sm text-gray-600">Based on current data</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SystemDashboard;