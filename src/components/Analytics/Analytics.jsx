import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAsyncAction } from '../../hooks/useApi';
import ReactECharts from 'echarts-for-react';
import { FiAlertTriangle, FiShield, FiTrendingUp, FiBarChart, FiFileText, FiClock } from 'react-icons/fi';

const Analytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  
  // Enhanced analytics data with regulatory risks
  const analytics = {
    totalTasks: 45,
    completedTasks: 28,
    inProgressTasks: 12,
    todoTasks: 5,
    highPriorityTasks: 8,
    openTasks: 17,
    deviationsWithRegulatoryRisks: {
      high: 3,
      medium: 8,
      low: 12,
      total: 23
    },
    riskBreakdown: {
      timeline: { count: 5, percentage: 22 },
      documentation: { count: 8, percentage: 35 },
      investigation: { count: 4, percentage: 17 },
      capa: { count: 3, percentage: 13 },
      trending: { count: 3, percentage: 13 }
    },
    statusBreakdown: {
      initiated: 8,
      evaluation: 6,
      dispositionReview: 4,
      approval: 3,
      closure: 2
    },
    tasksByPriority: {
      high: 8,
      medium: 22,
      low: 15
    }
  };

  const regulatoryRiskChartOption = {
    title: {
      text: 'Deviations by Regulatory Risk Level',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
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
    series: [
      {
        name: 'Risk Level',
        type: 'pie',
        radius: '50%',
        data: [
          { value: analytics.deviationsWithRegulatoryRisks.high, name: 'High Risk', itemStyle: { color: '#EF4444' } },
          { value: analytics.deviationsWithRegulatoryRisks.medium, name: 'Medium Risk', itemStyle: { color: '#F59E0B' } },
          { value: analytics.deviationsWithRegulatoryRisks.low, name: 'Low Risk', itemStyle: { color: '#10B981' } }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        }
      }
    ]
  };

  const riskBreakdownChartOption = {
    title: {
      text: 'Risk Factor Breakdown',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Timeline', 'Documentation', 'Investigation', 'CAPA', 'Trending']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Risk Count',
        type: 'bar',
        data: [
          analytics.riskBreakdown.timeline.count,
          analytics.riskBreakdown.documentation.count,
          analytics.riskBreakdown.investigation.count,
          analytics.riskBreakdown.capa.count,
          analytics.riskBreakdown.trending.count
        ],
        itemStyle: {
          color: function(params) {
            const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
  };

  const statusChartOption = {
    title: {
      text: 'Deviation Status Distribution',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: ['Initiated', 'Evaluation', 'Disposition Review', 'Approval', 'Closure'],
      axisLabel: {
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Count',
        type: 'bar',
        data: [
          analytics.statusBreakdown.initiated,
          analytics.statusBreakdown.evaluation,
          analytics.statusBreakdown.dispositionReview,
          analytics.statusBreakdown.approval,
          analytics.statusBreakdown.closure
        ],
        itemStyle: {
          color: function(params) {
            const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#10B981', '#6B7280'];
            return colors[params.dataIndex];
          }
        }
      }
    ]
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Regulatory Risk Management</h2>
            <p className="text-gray-600">Comprehensive insights into deviation management and regulatory compliance</p>
          </div>
          <div>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="form-input"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <h3 className="text-lg font-semibold text-gray-900">Total Deviations</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.totalTasks}</p>
              <p className="text-sm text-gray-500 mt-1">All time</p>
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
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Regulatory Risks</h3>
              <p className="text-3xl font-bold text-red-600">{analytics.deviationsWithRegulatoryRisks.total}</p>
              <p className="text-sm text-gray-500 mt-1">High: {analytics.deviationsWithRegulatoryRisks.high} | Medium: {analytics.deviationsWithRegulatoryRisks.medium}</p>
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
              <h3 className="text-lg font-semibold text-gray-900">Open Tasks</h3>
              <p className="text-3xl font-bold text-yellow-600">{analytics.openTasks}</p>
              <p className="text-sm text-gray-500 mt-1">Requiring attention</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiShield className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Compliance Rate</h3>
              <p className="text-3xl font-bold text-green-600">87.4%</p>
              <p className="text-sm text-gray-500 mt-1">Average quality score</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Regulatory Risk Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <ReactECharts option={regulatoryRiskChartOption} style={{ height: '400px' }} />
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <ReactECharts option={riskBreakdownChartOption} style={{ height: '400px' }} />
        </motion.div>
      </div>

      {/* Status Distribution and Risk Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <ReactECharts option={statusChartOption} style={{ height: '400px' }} />
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Risk Factor Details</h3>
          </div>
          
          <div className="space-y-4">
            {Object.entries(analytics.riskBreakdown).map(([factor, data]) => (
              <div key={factor} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {factor.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{data.count}</span>
                    <span className="text-xs text-gray-500">({data.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-red-400 to-red-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.percentage}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="text-sm font-semibold text-red-900 mb-2">High Priority Actions</h4>
            <ul className="text-sm text-red-800 space-y-1">
              <li>• Review documentation completeness for 8 deviations</li>
              <li>• Address timeline compliance issues for 5 investigations</li>
              <li>• Complete CAPA effectiveness reviews for 3 cases</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;