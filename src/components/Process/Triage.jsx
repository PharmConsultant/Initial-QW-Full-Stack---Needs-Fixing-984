import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiShield, FiClock, FiActivity, FiTarget, FiUsers } from 'react-icons/fi';
import ReactECharts from 'echarts-for-react';

function Triage() {
  const [selectedView, setSelectedView] = useState('classification');

  // Mock triage data
  const triageData = {
    totalTriaged: 89,
    pendingTriage: 12,
    avgTriageTime: '45 minutes',
    classifications: {
      critical: 8,
      major: 23,
      minor: 58
    },
    immediateActions: {
      quarantine: 15,
      lineStop: 8,
      productHold: 12,
      investigation: 45,
      noAction: 9
    },
    triageByDepartment: {
      labels: ['Production', 'Quality Control', 'Packaging', 'Warehouse', 'Maintenance'],
      values: [35, 22, 18, 8, 6]
    },
    recentTriage: [
      {
        id: 'DEV-2024-045',
        event: 'Temperature excursion in cold storage',
        classification: 'Major',
        immediateAction: 'Product quarantine initiated',
        triageBy: 'Sarah Johnson',
        time: '15 minutes ago',
        riskScore: 7.2
      },
      {
        id: 'DEV-2024-044',
        event: 'Documentation error in batch record',
        classification: 'Minor',
        immediateAction: 'Batch record review',
        triageBy: 'Mike Chen',
        time: '1 hour ago',
        riskScore: 3.5
      },
      {
        id: 'DEV-2024-043',
        event: 'Equipment malfunction - critical system',
        classification: 'Critical',
        immediateAction: 'Line stop and containment',
        triageBy: 'Jennifer Smith',
        time: '2 hours ago',
        riskScore: 9.1
      }
    ]
  };

  const classificationChart = {
    title: {
      text: 'Event Classification Distribution',
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
        { value: triageData.classifications.critical, name: 'Critical', itemStyle: { color: '#EF4444' } },
        { value: triageData.classifications.major, name: 'Major', itemStyle: { color: '#F59E0B' } },
        { value: triageData.classifications.minor, name: 'Minor', itemStyle: { color: '#10B981' } }
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

  const immediateActionsChart = {
    title: {
      text: 'Immediate Actions Taken',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: ['Quarantine', 'Line Stop', 'Product Hold', 'Investigation', 'No Action'],
      axisLabel: { rotate: 45 }
    },
    yAxis: { type: 'value' },
    series: [{
      name: 'Actions',
      type: 'bar',
      data: Object.values(triageData.immediateActions),
      itemStyle: { color: '#3B82F6' }
    }]
  };

  const departmentChart = {
    title: {
      text: 'Triage Events by Department',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: triageData.triageByDepartment.labels
    },
    yAxis: { type: 'value' },
    series: [{
      name: 'Events',
      type: 'bar',
      data: triageData.triageByDepartment.values,
      itemStyle: { color: '#8B5CF6' }
    }]
  };

  const getClassificationColor = (classification) => {
    switch (classification) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Major': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Minor': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 8) return 'text-red-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-orange-100 rounded-xl">
            <FiAlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Step 2: Triage & Immediate Actions</h1>
            <p className="text-gray-600 mt-1">Assess impact, classify events, and implement immediate containment</p>
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
              <FiTarget className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Total Triaged</h3>
              <p className="text-3xl font-bold text-blue-600">{triageData.totalTriaged}</p>
              <p className="text-sm text-gray-500 mt-1">Events processed</p>
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Triage</h3>
              <p className="text-3xl font-bold text-yellow-600">{triageData.pendingTriage}</p>
              <p className="text-sm text-gray-500 mt-1">Awaiting assessment</p>
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
            <div className="p-2 bg-green-100 rounded-lg">
              <FiActivity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Avg Triage Time</h3>
              <p className="text-3xl font-bold text-green-600">{triageData.avgTriageTime}</p>
              <p className="text-sm text-gray-500 mt-1">Per event</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart Selection and Display */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedView('classification')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'classification'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Classification
            </button>
            <button
              onClick={() => setSelectedView('actions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'actions'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Immediate Actions
            </button>
            <button
              onClick={() => setSelectedView('departments')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedView === 'departments'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              By Department
            </button>
          </div>
        </div>

        {selectedView === 'classification' && (
          <ReactECharts option={classificationChart} style={{ height: '400px' }} />
        )}
        {selectedView === 'actions' && (
          <ReactECharts option={immediateActionsChart} style={{ height: '400px' }} />
        )}
        {selectedView === 'departments' && (
          <ReactECharts option={departmentChart} style={{ height: '400px' }} />
        )}
      </motion.div>

      {/* Process Guidelines */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Triage & Immediate Actions Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Assessment Criteria:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-red-600 mt-1">•</span>
                <span>Immediate impact on product quality</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-orange-600 mt-1">•</span>
                <span>Patient safety implications</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Process safety and environmental impact</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Regulatory compliance requirements</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">Immediate Actions:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Quarantine affected products if necessary</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Stop production line if critical</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Secure evidence and maintain chain of custody</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Notify appropriate stakeholders</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Recent Triage Activities */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Triage Activities</h3>
        <div className="space-y-4">
          {triageData.recentTriage.map((triage, index) => (
            <motion.div
              key={triage.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4 flex-1">
                <div>
                  <h4 className="font-medium text-gray-900">{triage.id}</h4>
                  <p className="text-sm text-gray-600">{triage.event}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getClassificationColor(triage.classification)}`}>
                      {triage.classification}
                    </span>
                    <div className="flex items-center space-x-1">
                      <FiUsers className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">{triage.triageBy}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-500">Risk Score:</span>
                  <span className={`text-sm font-bold ${getRiskScoreColor(triage.riskScore)}`}>
                    {triage.riskScore}
                  </span>
                </div>
                <p className="text-xs text-blue-600 mb-1">{triage.immediateAction}</p>
                <span className="text-xs text-gray-500">{triage.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Triage;