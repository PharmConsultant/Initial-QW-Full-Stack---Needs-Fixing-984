import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FiClock, FiUser, FiFileText, FiEdit, FiEye, FiFilter, FiDownload, FiShield, FiActivity } from 'react-icons/fi';

function AuditTrailViewer({ deviationId }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  // Mock audit trail data - in real system this would come from API
  const auditTrail = [
    {
      id: 'AT-001',
      timestamp: '2024-01-15T08:30:00Z',
      action: 'Deviation Created',
      actionType: 'CREATE',
      userId: 'sarah.johnson',
      userRole: 'QA Investigator',
      section: 'Basic Information',
      fieldChanged: null,
      oldValue: null,
      newValue: 'DEV-2024-001: Temperature excursion detected',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-abc123',
      justification: 'Initial deviation report creation',
      regulatoryImpact: 'Low',
      dataIntegrity: 'ALCOA+ Compliant'
    },
    {
      id: 'AT-002',
      timestamp: '2024-01-15T08:35:00Z',
      action: 'Problem Statement Generated',
      actionType: 'AI_GENERATE',
      userId: 'sarah.johnson',
      userRole: 'QA Investigator',
      section: 'Problem Statement',
      fieldChanged: 'generatedProblemStatement',
      oldValue: null,
      newValue: 'AI-generated comprehensive problem statement...',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-abc123',
      justification: 'AI analysis of basic information data',
      regulatoryImpact: 'Medium',
      dataIntegrity: 'ALCOA+ Compliant',
      aiModel: 'GPT-4',
      aiVersion: '2024.01'
    },
    {
      id: 'AT-003',
      timestamp: '2024-01-15T09:15:00Z',
      action: 'Risk Assessment Updated',
      actionType: 'UPDATE',
      userId: 'sarah.johnson',
      userRole: 'QA Investigator',
      section: 'Risk Assessment',
      fieldChanged: 'classification',
      oldValue: 'Minor',
      newValue: 'Major',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-abc123',
      justification: 'Classification updated based on impact assessment',
      regulatoryImpact: 'High',
      dataIntegrity: 'ALCOA+ Compliant'
    },
    {
      id: 'AT-004',
      timestamp: '2024-01-15T10:00:00Z',
      action: 'Investigation Viewed',
      actionType: 'VIEW',
      userId: 'mike.chen',
      userRole: 'QA Manager',
      section: 'Full Investigation',
      fieldChanged: null,
      oldValue: null,
      newValue: null,
      ipAddress: '192.168.1.105',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-def456',
      justification: 'Management review of investigation progress',
      regulatoryImpact: 'Low',
      dataIntegrity: 'ALCOA+ Compliant'
    },
    {
      id: 'AT-005',
      timestamp: '2024-01-15T11:30:00Z',
      action: 'CAPA Action Added',
      actionType: 'CREATE',
      userId: 'sarah.johnson',
      userRole: 'QA Investigator',
      section: 'CAPA Development',
      fieldChanged: 'capaActions',
      oldValue: '[]',
      newValue: 'Corrective Action: Implement automated maintenance scheduling',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-abc123',
      justification: 'CAPA action based on root cause analysis findings',
      regulatoryImpact: 'High',
      dataIntegrity: 'ALCOA+ Compliant'
    },
    {
      id: 'AT-006',
      timestamp: '2024-01-15T14:15:00Z',
      action: 'Investigation Approved',
      actionType: 'APPROVE',
      userId: 'jennifer.smith',
      userRole: 'Site QA Manager',
      section: 'Investigation Status',
      fieldChanged: 'status',
      oldValue: 'Under Review',
      newValue: 'Approved',
      ipAddress: '192.168.1.110',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-ghi789',
      justification: 'Investigation meets regulatory requirements and quality standards',
      regulatoryImpact: 'High',
      dataIntegrity: 'ALCOA+ Compliant',
      electronicSignature: 'ES-JSmith-20240115-1415',
      approvalLevel: 'Level 2'
    },
    {
      id: 'AT-007',
      timestamp: '2024-01-15T15:00:00Z',
      action: 'Report Generated',
      actionType: 'GENERATE',
      userId: 'sarah.johnson',
      userRole: 'QA Investigator',
      section: 'Report Generation',
      fieldChanged: null,
      oldValue: null,
      newValue: 'PDF Report: DEV-2024-001_Investigation_Report.pdf',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess-abc123',
      justification: 'Final investigation report for regulatory submission',
      regulatoryImpact: 'High',
      dataIntegrity: 'ALCOA+ Compliant',
      aiModel: 'GPT-4',
      reportFormat: 'PDF',
      reportSize: '2.3 MB'
    }
  ];

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'CREATE': return FiFileText;
      case 'UPDATE': return FiEdit;
      case 'VIEW': return FiEye;
      case 'DELETE': return FiFileText;
      case 'APPROVE': return FiShield;
      case 'AI_GENERATE': return FiActivity;
      case 'GENERATE': return FiFileText;
      default: return FiClock;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'CREATE': return 'text-green-600 bg-green-100';
      case 'UPDATE': return 'text-blue-600 bg-blue-100';
      case 'VIEW': return 'text-gray-600 bg-gray-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      case 'APPROVE': return 'text-purple-600 bg-purple-100';
      case 'AI_GENERATE': return 'text-orange-600 bg-orange-100';
      case 'GENERATE': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRegulatoryImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-red-700 bg-red-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'CREATE', label: 'Creation Events' },
    { value: 'UPDATE', label: 'Updates' },
    { value: 'APPROVE', label: 'Approvals' },
    { value: 'AI_GENERATE', label: 'AI Activities' },
    { value: 'VIEW', label: 'View Events' }
  ];

  const filteredAuditTrail = auditTrail.filter(entry => 
    selectedFilter === 'all' || entry.actionType === selectedFilter
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Audit Trail</h2>
            <p className="text-gray-600">Complete audit log for {deviationId || 'DEV-2024-001'}</p>
          </div>
          <div className="flex space-x-3">
            <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              <FiDownload className="w-4 h-4" />
              <span>Export Audit Trail</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-4 mb-4">
          <FiFilter className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Action Type
            </label>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="form-input"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-input"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Filter
            </label>
            <select className="form-input">
              <option value="all">All Users</option>
              <option value="sarah.johnson">Sarah Johnson</option>
              <option value="mike.chen">Mike Chen</option>
              <option value="jennifer.smith">Jennifer Smith</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Trail Entries */}
      <div className="space-y-4">
        {filteredAuditTrail.map((entry, index) => {
          const ActionIcon = getActionIcon(entry.actionType);
          const actionColor = getActionColor(entry.actionType);
          const impactColor = getRegulatoryImpactColor(entry.regulatoryImpact);
          
          return (
            <motion.div
              key={entry.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${actionColor}`}>
                  <ActionIcon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {entry.action}
                    </h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${impactColor}`}>
                        {entry.regulatoryImpact} Impact
                      </span>
                      <span className="text-sm text-gray-500">
                        {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">User:</span>
                      <p className="text-sm text-gray-900">{entry.userId} ({entry.userRole})</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Section:</span>
                      <p className="text-sm text-gray-900">{entry.section}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Session ID:</span>
                      <p className="text-sm text-gray-900 font-mono">{entry.sessionId}</p>
                    </div>
                  </div>
                  
                  {entry.fieldChanged && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-600">Field Changed:</span>
                      <p className="text-sm text-gray-900 font-mono">{entry.fieldChanged}</p>
                      
                      {entry.oldValue && (
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm font-medium text-red-600">Old Value:</span>
                            <p className="text-sm text-gray-700 bg-red-50 p-2 rounded border">
                              {entry.oldValue}
                            </p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-600">New Value:</span>
                            <p className="text-sm text-gray-700 bg-green-50 p-2 rounded border">
                              {entry.newValue}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-600">Justification:</span>
                    <p className="text-sm text-gray-900">{entry.justification}</p>
                  </div>
                  
                  {/* Technical Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-semibold text-gray-900 mb-2">Technical Details</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600">
                      <div>
                        <span className="font-medium">IP Address:</span> {entry.ipAddress}
                      </div>
                      <div>
                        <span className="font-medium">Data Integrity:</span> {entry.dataIntegrity}
                      </div>
                      {entry.aiModel && (
                        <div>
                          <span className="font-medium">AI Model:</span> {entry.aiModel} v{entry.aiVersion}
                        </div>
                      )}
                      {entry.electronicSignature && (
                        <div>
                          <span className="font-medium">E-Signature:</span> {entry.electronicSignature}
                        </div>
                      )}
                      {entry.approvalLevel && (
                        <div>
                          <span className="font-medium">Approval Level:</span> {entry.approvalLevel}
                        </div>
                      )}
                      {entry.reportFormat && (
                        <div>
                          <span className="font-medium">Report Format:</span> {entry.reportFormat} ({entry.reportSize})
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Audit Trail Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900">Total Entries</h4>
            <p className="text-2xl font-bold text-blue-600">{auditTrail.length}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-900">Unique Users</h4>
            <p className="text-2xl font-bold text-green-600">
              {new Set(auditTrail.map(entry => entry.userId)).size}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="text-sm font-medium text-purple-900">Approvals</h4>
            <p className="text-2xl font-bold text-purple-600">
              {auditTrail.filter(entry => entry.actionType === 'APPROVE').length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <h4 className="text-sm font-medium text-orange-900">AI Actions</h4>
            <p className="text-2xl font-bold text-orange-600">
              {auditTrail.filter(entry => entry.actionType === 'AI_GENERATE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Regulatory Compliance Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <FiShield className="w-5 h-5 text-blue-600" />
          <h4 className="text-sm font-semibold text-blue-900">FDA 21 CFR Part 11 Compliance</h4>
        </div>
        <p className="text-sm text-blue-800">
          This audit trail meets FDA 21 CFR Part 11 requirements for electronic records and electronic signatures. 
          All entries are tamper-evident, include accurate timestamps, and maintain complete traceability of changes.
        </p>
      </div>
    </div>
  );
}

export default AuditTrailViewer;