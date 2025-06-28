import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEye, FiCalendar, FiUser, FiFileText, FiClock, FiMapPin } from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';

function EventDiscovery() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  // Mock data for event discovery analytics
  const discoveryData = {
    totalEvents: 156,
    thisMonth: 23,
    avgDiscoveryTime: '2.3 hours',
    discoveryMethods: {
      labels: ['Routine Inspection', 'Process Monitoring', 'Quality Testing', 'Customer Complaint', 'Audit Finding', 'Other'],
      values: [45, 38, 32, 25, 12, 4]
    },
    discoveryTrends: {
      month: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        values: [8, 6, 5, 4]
      },
      quarter: {
        labels: ['Month 1', 'Month 2', 'Month 3'],
        values: [23, 18, 21]
      },
      year: {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        values: [62, 45, 38, 42]
      }
    },
    recentDiscoveries: [
      {
        id: 'DEV-2024-045',
        event: 'Temperature excursion detected in cold storage',
        discoveredBy: 'Maria Rodriguez',
        discoveryMethod: 'Routine Inspection',
        time: '2 hours ago',
        location: 'Building A - Cold Storage Room 2'
      },
      {
        id: 'DEV-2024-044',
        event: 'Documentation discrepancy in batch record',
        discoveredBy: 'James Chen',
        discoveryMethod: 'Quality Testing',
        time: '4 hours ago',
        location: 'QC Laboratory'
      },
      {
        id: 'DEV-2024-043',
        event: 'Equipment malfunction - Tablet Press #3',
        discoveredBy: 'Sarah Johnson',
        discoveryMethod: 'Process Monitoring',
        time: '6 hours ago',
        location: 'Production Line 2'
      }
    ]
  };

  const discoveryMethodsChart = {
    title: {
      text: 'Discovery Methods Distribution',
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
      name: 'Discovery Method',
      type: 'pie',
      radius: '60%',
      data: discoveryData.discoveryMethods.labels.map((label, index) => ({
        value: discoveryData.discoveryMethods.values[index],
        name: label
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0,0,0,0.5)'
        }
      }
    }]
  };

  const discoveryTrendsChart = {
    title: {
      text: `Event Discovery Trends - ${selectedTimeframe.charAt(0).toUpperCase() + selectedTimeframe.slice(1)}`,
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: discoveryData.discoveryTrends[selectedTimeframe].labels
    },
    yAxis: { type: 'value' },
    series: [{
      name: 'Events Discovered',
      type: 'bar',
      data: discoveryData.discoveryTrends[selectedTimeframe].values,
      itemStyle: { color: '#10B981' }
    }]
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-green-100 rounded-xl">
            <FiEye className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Step 1: Event Discovery</h1>
            <p className="text-gray-600 mt-1">Identify and document deviation or non-conformance events</p>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiFileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Events</h3>
              <p className="text-3xl font-bold text-blue-600">{discoveryData.totalEvents}</p>
              <p className="text-sm text-gray-500 mt-1">All time discoveries</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCalendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
              <p className="text-3xl font-bold text-green-600">{discoveryData.thisMonth}</p>
              <p className="text-sm text-gray-500 mt-1">Events discovered</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Avg Discovery Time</h3>
              <p className="text-3xl font-bold text-yellow-600">{discoveryData.avgDiscoveryTime}</p>
              <p className="text-sm text-gray-500 mt-1">From occurrence</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Discovery Methods Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ReactECharts option={discoveryMethodsChart} style={{ height: '400px' }} />
        </motion.div>

        {/* Discovery Trends Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="mb-4">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="form-input w-auto"
            >
              <option value="month">Monthly View</option>
              <option value="quarter">Quarterly View</option>
              <option value="year">Yearly View</option>
            </select>
          </div>
          <ReactECharts option={discoveryTrendsChart} style={{ height: '350px' }} />
        </motion.div>
      </div>

      {/* Process Guidelines */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Discovery Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Key Requirements:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Identify the deviation or non-conformance immediately</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Document the discovery date and person who identified it</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Capture initial details immediately to preserve accuracy</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Record the discovery method and circumstances</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Best Practices:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Use standardized discovery reporting forms</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Take photographs if applicable and safe</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Preserve evidence and maintain chain of custody</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Notify supervision immediately</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Recent Discoveries */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Event Discoveries</h3>
        <div className="space-y-4">
          {discoveryData.recentDiscoveries.map((discovery, index) => (
            <motion.div
              key={discovery.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FiUser className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{discovery.discoveredBy}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{discovery.id}</h4>
                  <p className="text-sm text-gray-600">{discovery.event}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <div className="flex items-center space-x-1">
                      <FiMapPin className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{discovery.location}</span>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {discovery.discoveryMethod}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500">{discovery.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default EventDiscovery;