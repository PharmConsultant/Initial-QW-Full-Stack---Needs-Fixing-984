import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAsyncAction } from '../../hooks/useApi';
import ReactECharts from 'echarts-for-react';
import { FiAlertTriangle, FiShield, FiTrendingUp, FiBarChart, FiFileText, FiClock, FiRepeat, FiUsers, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const AdvancedAnalytics = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [expandedInvestigator, setExpandedInvestigator] = useState(null);

  // Enhanced analytics data with linked time periods
  const analytics = {
    totalDeviations: {
      week: { count: 12, period: 'Current Week' },
      month: { count: 45, period: 'Current Month' },
      quarter: { count: 134, period: 'Current Quarter' },
      year: { count: 425, period: 'Current Year' },
      total: { count: 1247, period: 'All Time' }
    },
    recurringDeviations: {
      week: { count: 3, period: 'Current Week' },
      month: { count: 8, period: 'Current Month' },
      quarter: { count: 23, period: 'Current Quarter' },
      year: { count: 67, period: 'Current Year' },
      total: { count: 189, period: 'All Time' }
    },
    qualityScores: {
      investigators: [
        {
          name: 'Sarah Johnson',
          score: 94,
          trend: 'up',
          change: '+2%',
          investigations: 23,
          details: {
            avgTimeToComplete: '4.2 days',
            onTimeCompletion: '96%',
            capaEffectiveness: '89%',
            documentationQuality: '95%',
            recentInvestigations: [
              { id: 'DEV-2024-045', score: 96, type: 'Temperature Excursion' },
              { id: 'DEV-2024-038', score: 92, type: 'Documentation Error' },
              { id: 'DEV-2024-031', score: 94, type: 'Equipment Malfunction' }
            ],
            strengths: ['Thorough documentation', 'Timely completion', 'Effective CAPA'],
            improvements: ['Root cause analysis depth', 'Trending analysis']
          }
        },
        {
          name: 'Mike Chen',
          score: 91,
          trend: 'up',
          change: '+1%',
          investigations: 18,
          details: {
            avgTimeToComplete: '3.8 days',
            onTimeCompletion: '94%',
            capaEffectiveness: '92%',
            documentationQuality: '88%',
            recentInvestigations: [
              { id: 'DEV-2024-042', score: 93, type: 'Process Deviation' },
              { id: 'DEV-2024-035', score: 89, type: 'Material Issue' },
              { id: 'DEV-2024-028', score: 91, type: 'Equipment Calibration' }
            ],
            strengths: ['Quick turnaround', 'Strong CAPA development'],
            improvements: ['Documentation detail', 'Risk assessment']
          }
        },
        {
          name: 'Jennifer Smith',
          score: 96,
          trend: 'stable',
          change: '0%',
          investigations: 31,
          details: {
            avgTimeToComplete: '3.5 days',
            onTimeCompletion: '98%',
            capaEffectiveness: '94%',
            documentationQuality: '97%',
            recentInvestigations: [
              { id: 'DEV-2024-047', score: 98, type: 'Critical Deviation' },
              { id: 'DEV-2024-040', score: 95, type: 'Quality Control' },
              { id: 'DEV-2024-033', score: 96, type: 'Manufacturing' }
            ],
            strengths: ['Exceptional documentation', 'Comprehensive analysis', 'Regulatory compliance'],
            improvements: ['Continue current excellence']
          }
        },
        {
          name: 'David Wilson',
          score: 87,
          trend: 'down',
          change: '-3%',
          investigations: 15,
          details: {
            avgTimeToComplete: '5.1 days',
            onTimeCompletion: '85%',
            capaEffectiveness: '78%',
            documentationQuality: '82%',
            recentInvestigations: [
              { id: 'DEV-2024-041', score: 84, type: 'Equipment Issue' },
              { id: 'DEV-2024-034', score: 88, type: 'Process Control' },
              { id: 'DEV-2024-027', score: 89, type: 'Documentation' }
            ],
            strengths: ['Technical expertise', 'Equipment knowledge'],
            improvements: ['Timeline management', 'CAPA effectiveness', 'Documentation quality']
          }
        },
        {
          name: 'Lisa Anderson',
          score: 92,
          trend: 'up',
          change: '+4%',
          investigations: 21,
          details: {
            avgTimeToComplete: '4.0 days',
            onTimeCompletion: '92%',
            capaEffectiveness: '90%',
            documentationQuality: '93%',
            recentInvestigations: [
              { id: 'DEV-2024-044', score: 94, type: 'Quality Assurance' },
              { id: 'DEV-2024-037', score: 90, type: 'Process Improvement' },
              { id: 'DEV-2024-030', score: 92, type: 'System Validation' }
            ],
            strengths: ['Improving performance', 'Good analysis skills'],
            improvements: ['Consistency', 'Advanced RCA techniques']
          }
        },
        {
          name: 'Robert Taylor',
          score: 89,
          trend: 'up',
          change: '+2%',
          investigations: 12,
          details: {
            avgTimeToComplete: '4.5 days',
            onTimeCompletion: '88%',
            capaEffectiveness: '85%',
            documentationQuality: '90%',
            recentInvestigations: [
              { id: 'DEV-2024-043', score: 91, type: 'Environmental' },
              { id: 'DEV-2024-036', score: 87, type: 'Safety Related' },
              { id: 'DEV-2024-029', score: 89, type: 'Maintenance' }
            ],
            strengths: ['Safety focus', 'Environmental awareness'],
            improvements: ['Speed of completion', 'CAPA development']
          }
        }
      ]
    },
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
    }
  };

  // Create investigator dashboard data
  const createInvestigatorDashboard = (investigator) => {
    return {
      title: `${investigator.name} - Performance Dashboard`,
      charts: [
        {
          type: 'gauge',
          title: 'Overall Score',
          data: investigator.score,
          color: investigator.score >= 90 ? '#10B981' : investigator.score >= 80 ? '#F59E0B' : '#EF4444'
        },
        {
          type: 'bar',
          title: 'Performance Metrics',
          data: {
            categories: ['On-Time', 'CAPA Eff.', 'Doc Quality'],
            values: [
              parseInt(investigator.details.onTimeCompletion),
              parseInt(investigator.details.capaEffectiveness),
              parseInt(investigator.details.documentationQuality)
            ]
          }
        },
        {
          type: 'line',
          title: 'Recent Investigation Scores',
          data: {
            categories: investigator.details.recentInvestigations.map(inv => inv.id),
            values: investigator.details.recentInvestigations.map(inv => inv.score)
          }
        }
      ]
    };
  };

  const toggleInvestigatorDetails = (index) => {
    setExpandedInvestigator(expandedInvestigator === index ? null : index);
  };

  // Gauge chart for individual score
  const createGaugeChart = (score, title) => ({
    title: {
      text: title,
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold' }
    },
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      itemStyle: {
        color: score >= 90 ? '#10B981' : score >= 80 ? '#F59E0B' : '#EF4444'
      },
      progress: { show: true, width: 8 },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 8 } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: 'inherit',
        fontSize: 20,
        fontWeight: 'bold'
      },
      data: [{ value: score }]
    }]
  });

  // Performance metrics bar chart
  const createPerformanceChart = (data) => ({
    title: {
      text: 'Performance Metrics',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: { fontSize: 10 }
    },
    yAxis: { type: 'value', max: 100 },
    series: [{
      type: 'bar',
      data: data.values,
      itemStyle: { color: '#3B82F6' },
      barWidth: '60%'
    }]
  });

  // Recent scores line chart
  const createRecentScoresChart = (data) => ({
    title: {
      text: 'Recent Investigation Scores',
      left: 'center',
      textStyle: { fontSize: 14, fontWeight: 'bold' }
    },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: data.categories,
      axisLabel: { fontSize: 10, rotate: 45 }
    },
    yAxis: { type: 'value', min: 80, max: 100 },
    series: [{
      type: 'line',
      data: data.values,
      itemStyle: { color: '#8B5CF6' },
      lineStyle: { width: 3 },
      symbol: 'circle',
      symbolSize: 6
    }]
  });

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics & Insights</h2>
            <p className="text-gray-600">Comprehensive deviation management and quality metrics with investigator performance dashboards</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="form-input"
            >
              <option value="week">By Week</option>
              <option value="month">By Month</option>
              <option value="quarter">By Quarter</option>
              <option value="year">By Year</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Object.entries(analytics.totalDeviations).map(([period, data], index) => (
          <motion.div
            key={period}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  {data.period}
                </h3>
                <p className="text-2xl font-bold text-blue-600">{data.count}</p>
                <p className="text-xs text-gray-500 mt-1">Total Deviations</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Investigator Performance Section */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiUsers className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Investigator Performance Dashboards</h3>
        </div>

        <div className="space-y-4">
          {analytics.qualityScores.investigators.map((investigator, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              {/* Investigator Summary Row */}
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => toggleInvestigatorDetails(index)}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">
                      {investigator.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{investigator.name}</p>
                    <p className="text-xs text-gray-500">{investigator.investigations} investigations</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${
                        investigator.score >= 95 ? 'text-green-600' : 
                        investigator.score >= 90 ? 'text-blue-600' : 
                        investigator.score >= 85 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {investigator.score}%
                      </div>
                      <div className="flex items-center space-x-1">
                        {investigator.trend === 'up' ? (
                          <FiTrendingUp className="w-3 h-3 text-green-500" />
                        ) : investigator.trend === 'down' ? (
                          <FiTrendingUp className="w-3 h-3 text-red-500 transform rotate-180" />
                        ) : (
                          <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
                        )}
                        <span className={`text-xs ${
                          investigator.trend === 'up' ? 'text-green-600' : 
                          investigator.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {investigator.change}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {expandedInvestigator === index ? (
                        <FiChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <FiChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Dashboard */}
              {expandedInvestigator === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 p-6 bg-white rounded-b-lg"
                >
                  {/* Performance Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900">Avg Completion Time</h4>
                      <p className="text-xl font-bold text-blue-600">{investigator.details.avgTimeToComplete}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-green-900">On-Time Completion</h4>
                      <p className="text-xl font-bold text-green-600">{investigator.details.onTimeCompletion}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-purple-900">CAPA Effectiveness</h4>
                      <p className="text-xl font-bold text-purple-600">{investigator.details.capaEffectiveness}</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-yellow-900">Documentation Quality</h4>
                      <p className="text-xl font-bold text-yellow-600">{investigator.details.documentationQuality}</p>
                    </div>
                  </div>

                  {/* Mini Dashboard Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ReactECharts 
                        option={createGaugeChart(investigator.score, 'Overall Score')} 
                        style={{ height: '200px' }} 
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ReactECharts 
                        option={createPerformanceChart({
                          categories: ['On-Time', 'CAPA Eff.', 'Doc Quality'],
                          values: [
                            parseInt(investigator.details.onTimeCompletion),
                            parseInt(investigator.details.capaEffectiveness),
                            parseInt(investigator.details.documentationQuality)
                          ]
                        })} 
                        style={{ height: '200px' }} 
                      />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <ReactECharts 
                        option={createRecentScoresChart({
                          categories: investigator.details.recentInvestigations.map(inv => inv.id),
                          values: investigator.details.recentInvestigations.map(inv => inv.score)
                        })} 
                        style={{ height: '200px' }} 
                      />
                    </div>
                  </div>

                  {/* Recent Investigations */}
                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Recent Investigations</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {investigator.details.recentInvestigations.map((inv, invIndex) => (
                        <div key={invIndex} className="bg-white border border-gray-200 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{inv.id}</span>
                            <span className={`text-sm font-bold ${
                              inv.score >= 95 ? 'text-green-600' : 
                              inv.score >= 90 ? 'text-blue-600' : 'text-yellow-600'
                            }`}>
                              {inv.score}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{inv.type}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Strengths</h4>
                      <ul className="space-y-2">
                        {investigator.details.strengths.map((strength, sIndex) => (
                          <li key={sIndex} className="flex items-center space-x-2">
                            <FiCheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 mb-3">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {investigator.details.improvements.map((improvement, iIndex) => (
                          <li key={iIndex} className="flex items-center space-x-2">
                            <FiAlertTriangle className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdvancedAnalytics;