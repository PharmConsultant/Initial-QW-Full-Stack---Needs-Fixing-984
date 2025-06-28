import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAlertTriangle, FiClock, FiCheckCircle, FiTrendingUp, FiPlus, FiFileText } from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';
import StatsCard from './StatsCard';
import RecentDeviations from './RecentDeviations';
import ComplianceStatus from './ComplianceStatus';

function Dashboard() {
  const stats = [
    {
      title: 'Open Deviations',
      value: 23,
      icon: FiAlertTriangle,
      color: 'red',
      change: '+3 this week',
      trend: 'up'
    },
    {
      title: 'Pending Review',
      value: 8,
      icon: FiClock,
      color: 'yellow',
      change: '-2 from last week',
      trend: 'down'
    },
    {
      title: 'Completed This Month',
      value: 47,
      icon: FiCheckCircle,
      color: 'green',
      change: '+12% vs last month',
      trend: 'up'
    },
    {
      title: 'Average Resolution Time',
      value: '4.2 days',
      icon: FiTrendingUp,
      color: 'blue',
      change: '-0.8 days improvement',
      trend: 'down'
    }
  ];

  // Deviations by Classification data
  const classificationData = {
    minor: 15,
    major: 6,
    critical: 2
  };

  const classificationChartOption = {
    title: {
      text: 'Deviations by Classification',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      name: 'Classification',
      type: 'pie',
      radius: '60%',
      data: [
        { value: classificationData.critical, name: 'Critical', itemStyle: { color: '#EF4444' } },
        { value: classificationData.major, name: 'Major', itemStyle: { color: '#F59E0B' } },
        { value: classificationData.minor, name: 'Minor', itemStyle: { color: '#10B981' } }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      }
    }]
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
              Deviation Investigation Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              FDA 21 CFR 210/211 Compliant Investigation Management
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/investigation"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              <span>New Investigation</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FiFileText className="w-5 h-5" />
              <span>Generate Report</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Classification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Minor</h3>
              <p className="text-3xl font-bold text-green-600">{classificationData.minor}</p>
              <p className="text-sm text-gray-500 mt-1">Low impact deviations</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Major</h3>
              <p className="text-3xl font-bold text-yellow-600">{classificationData.major}</p>
              <p className="text-sm text-gray-500 mt-1">Significant impact</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Critical</h3>
              <p className="text-3xl font-bold text-red-600">{classificationData.critical}</p>
              <p className="text-sm text-gray-500 mt-1">High impact/urgent</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Deviations */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <RecentDeviations />
        </motion.div>

        {/* Classification Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ReactECharts option={classificationChartOption} style={{ height: '300px' }} />
          </div>
        </motion.div>
      </div>

      {/* Compliance Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <ComplianceStatus />
      </motion.div>
    </div>
  );
}

export default Dashboard;