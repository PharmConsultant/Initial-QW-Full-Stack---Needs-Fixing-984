import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUpload, FiFile, FiEdit3, FiTrash2, FiEye, FiSettings,
  FiPlus, FiSave, FiDownload, FiFileText, FiCpu, FiActivity, 
  FiTool, FiUsers, FiSlack, FiMessageSquare
} from 'react-icons/fi';
import AIModelConfiguration from './AIModelConfiguration';

function SystemConfiguration() {
  const [activeTab, setActiveTab] = useState('general');
  
  const [systemSettings, setSystemSettings] = useState({
    deviationIdFormat: 'DEV-{YYYY}-{###}',
    batchLotFormat: 'LOT-{YYYY}{MM}-{###}',
    productNameFormat: '{Name} {Dosage} {Form}',
    timelineSettings: {
      occurrenceToDiscovery: 3,
      discoveryToOpening: 3,
      daysToClose: 30,
      requireJustification: true
    },
    statusOptions: [
      'Initiated',
      'Evaluation', 
      'Disposition Review',
      'Approval',
      'Closure'
    ],
    departments: [
      'Quality Assurance',
      'Manufacturing',
      'Quality Control',
      'Regulatory Affairs',
      'Production',
      'Packaging',
      'Warehouse',
      'Maintenance',
      'Engineering',
      'Information Technology'
    ],
    roles: [
      'QA Director',
      'QA Manager', 
      'QA Supervisor',
      'QA Investigator',
      'Mfg Shift Leader',
      'Mfg Supervisor',
      'Mfg Team Leader',
      'Sr. Dir Mfg',
      'Dir Mfg',
      'Production Supervisor',
      'Quality Engineer',
      'System Administrator'
    ],
    manufacturingAreas: [
      'Production Line 1',
      'Production Line 2', 
      'Packaging Area A',
      'Packaging Area B',
      'Quality Control Lab',
      'Quality Assurance',
      'Warehouse - Ambient',
      'Warehouse - Cold Storage',
      'Maintenance Shop',
      'Utilities'
    ],
    rcaTools: [
      { id: '5-whys', name: '5 Whys Method', enabled: true },
      { id: 'fishbone', name: 'Fishbone (Ishikawa)', enabled: true },
      { id: 'fault-tree', name: 'Fault Tree Analysis', enabled: true },
      { id: 'barrier-analysis', name: 'Barrier Analysis', enabled: true }
    ],
    integrations: {
      slack: {
        enabled: false,
        webhookUrl: '',
        botToken: '',
        channelId: ''
      },
      teams: {
        enabled: false,
        webhookUrl: '',
        tenantId: '',
        channelId: ''
      }
    }
  });

  const [newArea, setNewArea] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newRcaTool, setNewRcaTool] = useState({ name: '', description: '' });
  const [editingStatus, setEditingStatus] = useState({ index: -1, value: '' });
  const [editingDepartment, setEditingDepartment] = useState({ index: -1, value: '' });
  const [editingRole, setEditingRole] = useState({ index: -1, value: '' });

  // Status Options Management
  const addStatusOption = () => {
    if (newStatus.trim() && !systemSettings.statusOptions.includes(newStatus.trim())) {
      setSystemSettings(prev => ({
        ...prev,
        statusOptions: [...prev.statusOptions, newStatus.trim()]
      }));
      setNewStatus('');
    }
  };

  const removeStatusOption = (index) => {
    setSystemSettings(prev => ({
      ...prev,
      statusOptions: prev.statusOptions.filter((_, i) => i !== index)
    }));
  };

  const startEditingStatus = (index, value) => {
    setEditingStatus({ index, value });
  };

  const saveEditingStatus = () => {
    if (editingStatus.value.trim()) {
      setSystemSettings(prev => ({
        ...prev,
        statusOptions: prev.statusOptions.map((status, i) => 
          i === editingStatus.index ? editingStatus.value.trim() : status
        )
      }));
    }
    setEditingStatus({ index: -1, value: '' });
  };

  const cancelEditingStatus = () => {
    setEditingStatus({ index: -1, value: '' });
  };

  // Department Management
  const addDepartment = () => {
    if (newDepartment.trim() && !systemSettings.departments.includes(newDepartment.trim())) {
      setSystemSettings(prev => ({
        ...prev,
        departments: [...prev.departments, newDepartment.trim()]
      }));
      setNewDepartment('');
    }
  };

  const removeDepartment = (index) => {
    setSystemSettings(prev => ({
      ...prev,
      departments: prev.departments.filter((_, i) => i !== index)
    }));
  };

  const startEditingDepartment = (index, value) => {
    setEditingDepartment({ index, value });
  };

  const saveEditingDepartment = () => {
    if (editingDepartment.value.trim()) {
      setSystemSettings(prev => ({
        ...prev,
        departments: prev.departments.map((dept, i) => 
          i === editingDepartment.index ? editingDepartment.value.trim() : dept
        )
      }));
    }
    setEditingDepartment({ index: -1, value: '' });
  };

  // Role Management
  const addRole = () => {
    if (newRole.trim() && !systemSettings.roles.includes(newRole.trim())) {
      setSystemSettings(prev => ({
        ...prev,
        roles: [...prev.roles, newRole.trim()]
      }));
      setNewRole('');
    }
  };

  const removeRole = (index) => {
    setSystemSettings(prev => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== index)
    }));
  };

  const startEditingRole = (index, value) => {
    setEditingRole({ index, value });
  };

  const saveEditingRole = () => {
    if (editingRole.value.trim()) {
      setSystemSettings(prev => ({
        ...prev,
        roles: prev.roles.map((role, i) => 
          i === editingRole.index ? editingRole.value.trim() : role
        )
      }));
    }
    setEditingRole({ index: -1, value: '' });
  };

  // Manufacturing Areas Management
  const addManufacturingArea = () => {
    if (newArea.trim()) {
      setSystemSettings(prev => ({
        ...prev,
        manufacturingAreas: [...prev.manufacturingAreas, newArea.trim()]
      }));
      setNewArea('');
    }
  };

  const removeManufacturingArea = (index) => {
    setSystemSettings(prev => ({
      ...prev,
      manufacturingAreas: prev.manufacturingAreas.filter((_, i) => i !== index)
    }));
  };

  // RCA Tools Management
  const addRcaTool = () => {
    if (newRcaTool.name.trim()) {
      const tool = {
        id: newRcaTool.name.toLowerCase().replace(/\s+/g, '-'),
        name: newRcaTool.name.trim(),
        description: newRcaTool.description.trim() || 'Custom RCA tool',
        enabled: true
      };
      setSystemSettings(prev => ({
        ...prev,
        rcaTools: [...prev.rcaTools, tool]
      }));
      setNewRcaTool({ name: '', description: '' });
    }
  };

  const toggleRcaTool = (toolId) => {
    setSystemSettings(prev => ({
      ...prev,
      rcaTools: prev.rcaTools.map(tool =>
        tool.id === toolId ? { ...tool, enabled: !tool.enabled } : tool
      )
    }));
  };

  const removeRcaTool = (toolId) => {
    setSystemSettings(prev => ({
      ...prev,
      rcaTools: prev.rcaTools.filter(tool => tool.id !== toolId)
    }));
  };

  const handleIntegrationChange = (integration, field, value) => {
    setSystemSettings(prev => ({
      ...prev,
      integrations: {
        ...prev.integrations,
        [integration]: {
          ...prev.integrations[integration],
          [field]: value
        }
      }
    }));
  };

  const tabs = [
    { id: 'general', label: 'General Settings', icon: FiSettings },
    { id: 'ai-models', label: 'AI Model Configuration', icon: FiCpu },
    { id: 'timeline', label: 'Timeline Configuration', icon: FiActivity },
    { id: 'workflow', label: 'Workflow & Status', icon: FiFileText },
    { id: 'roles', label: 'Roles & Departments', icon: FiUsers },
    { id: 'areas', label: 'Manufacturing Areas', icon: FiPlus },
    { id: 'rca-tools', label: 'RCA Tools', icon: FiTool },
    { id: 'integrations', label: 'Integrations', icon: FiSlack }
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Configuration</h1>
        <p className="text-gray-600">Configure system settings, AI models, and investigation tools</p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Naming Conventions</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deviation ID Format
                </label>
                <input
                  type="text"
                  value={systemSettings.deviationIdFormat}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, deviationIdFormat: e.target.value }))}
                  className="form-input"
                  placeholder="DEV-{YYYY}-{###}"
                />
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Preview:</strong> {systemSettings.deviationIdFormat.replace('{YYYY}', '2024').replace('{###}', '001')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch/Lot Format
                </label>
                <input
                  type="text"
                  value={systemSettings.batchLotFormat}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, batchLotFormat: e.target.value }))}
                  className="form-input"
                  placeholder="LOT-{YYYY}{MM}-{###}"
                />
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Preview:</strong> {systemSettings.batchLotFormat.replace('{YYYY}', '2024').replace('{MM}', '01').replace('{###}', '001')}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name Format
                </label>
                <input
                  type="text"
                  value={systemSettings.productNameFormat}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, productNameFormat: e.target.value }))}
                  className="form-input"
                  placeholder="{Name} {Dosage} {Form}"
                />
                <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                  <strong>Preview:</strong> {systemSettings.productNameFormat.replace('{Name}', 'Aspirin').replace('{Dosage}', '325mg').replace('{Form}', 'Tablets')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline Configuration Tab */}
      {activeTab === 'timeline' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Occurrence to Discovery (Business Days)
                </label>
                <input
                  type="number"
                  value={systemSettings.timelineSettings.occurrenceToDiscovery}
                  onChange={(e) => setSystemSettings(prev => ({
                    ...prev,
                    timelineSettings: {
                      ...prev.timelineSettings,
                      occurrenceToDiscovery: parseInt(e.target.value)
                    }
                  }))}
                  className="form-input"
                  min="1"
                  max="30"
                />
                <p className="text-xs text-gray-500 mt-1">Gateway G1 compliance window</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discovery to Opening (Business Days)
                </label>
                <input
                  type="number"
                  value={systemSettings.timelineSettings.discoveryToOpening}
                  onChange={(e) => setSystemSettings(prev => ({
                    ...prev,
                    timelineSettings: {
                      ...prev.timelineSettings,
                      discoveryToOpening: parseInt(e.target.value)
                    }
                  }))}
                  className="form-input"
                  min="1"
                  max="30"
                />
                <p className="text-xs text-gray-500 mt-1">Gateway G2 compliance window</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days to Close Investigation
                </label>
                <input
                  type="number"
                  value={systemSettings.timelineSettings.daysToClose}
                  onChange={(e) => setSystemSettings(prev => ({
                    ...prev,
                    timelineSettings: {
                      ...prev.timelineSettings,
                      daysToClose: parseInt(e.target.value)
                    }
                  }))}
                  className="form-input"
                  min="1"
                  max="365"
                />
                <p className="text-xs text-gray-500 mt-1">Client-specific closure deadline</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={systemSettings.timelineSettings.requireJustification}
                  onChange={(e) => setSystemSettings(prev => ({
                    ...prev,
                    timelineSettings: {
                      ...prev.timelineSettings,
                      requireJustification: e.target.checked
                    }
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Require justification for timeline exceedances</span>
              </label>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Timeline Summary</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>• Occurrence → Discovery: {systemSettings.timelineSettings.occurrenceToDiscovery} business days</p>
                <p>• Discovery → Opening: {systemSettings.timelineSettings.discoveryToOpening} business days</p>
                <p>• Investigation Closure: {systemSettings.timelineSettings.daysToClose} calendar days</p>
                <p>• Justification Required: {systemSettings.timelineSettings.requireJustification ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Models Tab */}
      {activeTab === 'ai-models' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AIModelConfiguration />
        </motion.div>
      )}

      {/* Workflow & Status Tab */}
      {activeTab === 'workflow' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investigation Status Configuration</h3>
            
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="Enter new status option..."
                className="flex-1 form-input"
                onKeyPress={(e) => e.key === 'Enter' && addStatusOption()}
              />
              <button
                onClick={addStatusOption}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Status</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Status Options:</h4>
              {systemSettings.statusOptions.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                    {editingStatus.index === index ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={editingStatus.value}
                          onChange={(e) => setEditingStatus(prev => ({ ...prev, value: e.target.value }))}
                          className="form-input flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && saveEditingStatus()}
                          autoFocus
                        />
                        <button
                          onClick={saveEditingStatus}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditingStatus}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span 
                        className="text-sm text-gray-900 flex-1 cursor-pointer hover:text-blue-600"
                        onClick={() => startEditingStatus(index, status)}
                      >
                        {status}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditingStatus(index, status)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeStatusOption(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      disabled={systemSettings.statusOptions.length <= 2}
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Roles & Departments Tab */}
      {activeTab === 'roles' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Departments Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Departments Configuration</h3>
            
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newDepartment}
                onChange={(e) => setNewDepartment(e.target.value)}
                placeholder="Enter new department..."
                className="flex-1 form-input"
                onKeyPress={(e) => e.key === 'Enter' && addDepartment()}
              />
              <button
                onClick={addDepartment}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Department</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Departments:</h4>
              {systemSettings.departments.map((dept, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {editingDepartment.index === index ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={editingDepartment.value}
                          onChange={(e) => setEditingDepartment(prev => ({ ...prev, value: e.target.value }))}
                          className="form-input flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && saveEditingDepartment()}
                          autoFocus
                        />
                        <button
                          onClick={saveEditingDepartment}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingDepartment({ index: -1, value: '' })}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span 
                        className="text-sm text-gray-900 flex-1 cursor-pointer hover:text-blue-600"
                        onClick={() => startEditingDepartment(index, dept)}
                      >
                        {dept}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditingDepartment(index, dept)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeDepartment(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Roles Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles Configuration</h3>
            
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Enter new role..."
                className="flex-1 form-input"
                onKeyPress={(e) => e.key === 'Enter' && addRole()}
              />
              <button
                onClick={addRole}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Role</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Roles:</h4>
              {systemSettings.roles.map((role, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 flex-1">
                    {editingRole.index === index ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <input
                          type="text"
                          value={editingRole.value}
                          onChange={(e) => setEditingRole(prev => ({ ...prev, value: e.target.value }))}
                          className="form-input flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && saveEditingRole()}
                          autoFocus
                        />
                        <button
                          onClick={saveEditingRole}
                          className="text-green-600 hover:text-green-800"
                        >
                          <FiSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingRole({ index: -1, value: '' })}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <span 
                        className="text-sm text-gray-900 flex-1 cursor-pointer hover:text-blue-600"
                        onClick={() => startEditingRole(index, role)}
                      >
                        {role}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startEditingRole(index, role)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeRole(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Manufacturing Areas Tab */}
      {activeTab === 'areas' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Manufacturing Areas Configuration</h3>
            
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Enter new manufacturing area..."
                className="flex-1 form-input"
                onKeyPress={(e) => e.key === 'Enter' && addManufacturingArea()}
              />
              <button
                onClick={addManufacturingArea}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Area</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Manufacturing Areas:</h4>
              {systemSettings.manufacturingAreas.map((area, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-900">{area}</span>
                  <button
                    onClick={() => removeManufacturingArea(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* RCA Tools Tab */}
      {activeTab === 'rca-tools' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Root Cause Analysis Tools</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <input
                type="text"
                value={newRcaTool.name}
                onChange={(e) => setNewRcaTool(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tool name..."
                className="form-input"
              />
              <input
                type="text"
                value={newRcaTool.description}
                onChange={(e) => setNewRcaTool(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description..."
                className="form-input"
              />
              <button
                onClick={addRcaTool}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add Tool</span>
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Available RCA Tools:</h4>
              {systemSettings.rcaTools.map((tool) => (
                <div key={tool.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={tool.enabled}
                      onChange={() => toggleRcaTool(tool.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{tool.name}</span>
                      <p className="text-xs text-gray-500">{tool.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeRcaTool(tool.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Enabled RCA tools will be available for selection during the Root Cause Analysis step. 
                Users can select multiple tools for comprehensive analysis.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Slack Integration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiSlack className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Slack Integration</h3>
              <label className="flex items-center space-x-2 ml-auto">
                <input
                  type="checkbox"
                  checked={systemSettings.integrations.slack.enabled}
                  onChange={(e) => handleIntegrationChange('slack', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Enable Slack Integration</span>
              </label>
            </div>

            {systemSettings.integrations.slack.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={systemSettings.integrations.slack.webhookUrl}
                    onChange={(e) => handleIntegrationChange('slack', 'webhookUrl', e.target.value)}
                    className="form-input"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Token
                  </label>
                  <input
                    type="password"
                    value={systemSettings.integrations.slack.botToken}
                    onChange={(e) => handleIntegrationChange('slack', 'botToken', e.target.value)}
                    className="form-input"
                    placeholder="xoxb-..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Channel ID
                  </label>
                  <input
                    type="text"
                    value={systemSettings.integrations.slack.channelId}
                    onChange={(e) => handleIntegrationChange('slack', 'channelId', e.target.value)}
                    className="form-input"
                    placeholder="#quality-alerts"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Microsoft Teams Integration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiMessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Microsoft Teams Integration</h3>
              <label className="flex items-center space-x-2 ml-auto">
                <input
                  type="checkbox"
                  checked={systemSettings.integrations.teams.enabled}
                  onChange={(e) => handleIntegrationChange('teams', 'enabled', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Enable Teams Integration</span>
              </label>
            </div>

            {systemSettings.integrations.teams.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    value={systemSettings.integrations.teams.webhookUrl}
                    onChange={(e) => handleIntegrationChange('teams', 'webhookUrl', e.target.value)}
                    className="form-input"
                    placeholder="https://outlook.office.com/webhook/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tenant ID
                  </label>
                  <input
                    type="text"
                    value={systemSettings.integrations.teams.tenantId}
                    onChange={(e) => handleIntegrationChange('teams', 'tenantId', e.target.value)}
                    className="form-input"
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Channel ID
                  </label>
                  <input
                    type="text"
                    value={systemSettings.integrations.teams.channelId}
                    onChange={(e) => handleIntegrationChange('teams', 'channelId', e.target.value)}
                    className="form-input"
                    placeholder="Quality Alerts"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
          <FiSave className="w-5 h-5" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  );
}

export default SystemConfiguration;