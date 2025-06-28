import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiBell, FiLock, FiMoon, FiSun, FiSettings as FiSettingsIcon, FiSlack, FiMessageSquare, FiPhone, FiMapPin } from 'react-icons/fi';
import SystemConfiguration from './SystemConfiguration';
import PasswordSettings from './PasswordSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Quality Assurance',
    role: 'QA Investigator',
    building: 'Building A',
    roomNumber: 'Room 205',
    slackHandle: '@john.doe',
    teamsHandle: 'john.doe@company.com'
  });

  // System configuration data for dropdowns
  const [systemConfig] = useState({
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
    ]
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'password', label: 'Password & Security', icon: FiLock },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'appearance', label: 'Appearance', icon: darkMode ? FiMoon : FiSun },
    { id: 'system', label: 'System Configuration', icon: FiSettingsIcon }
  ];

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => handleProfileChange('name', e.target.value)}
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => handleProfileChange('email', e.target.value)}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => handleProfileChange('phone', e.target.value)}
              className="form-input"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      {/* Role & Department */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Role & Department</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              value={profileData.department}
              onChange={(e) => handleProfileChange('department', e.target.value)}
              className="form-input"
            >
              {systemConfig.departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={profileData.role}
              onChange={(e) => handleProfileChange('role', e.target.value)}
              className="form-input"
            >
              {systemConfig.roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Location</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Building
            </label>
            <input
              type="text"
              value={profileData.building}
              onChange={(e) => handleProfileChange('building', e.target.value)}
              className="form-input"
              placeholder="Building A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number
            </label>
            <input
              type="text"
              value={profileData.roomNumber}
              onChange={(e) => handleProfileChange('roomNumber', e.target.value)}
              className="form-input"
              placeholder="Room 205"
            />
          </div>
        </div>
      </div>

      {/* Communication Integrations */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Communication Integrations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FiSlack className="w-4 h-4 text-purple-600" />
                <span>Slack Handle</span>
              </div>
            </label>
            <input
              type="text"
              value={profileData.slackHandle}
              onChange={(e) => handleProfileChange('slackHandle', e.target.value)}
              className="form-input"
              placeholder="@john.doe"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your Slack username for notifications and communication
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <FiMessageSquare className="w-4 h-4 text-blue-600" />
                <span>Microsoft Teams</span>
              </div>
            </label>
            <input
              type="email"
              value={profileData.teamsHandle}
              onChange={(e) => handleProfileChange('teamsHandle', e.target.value)}
              className="form-input"
              placeholder="john.doe@company.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your Teams email for notifications and communication
            </p>
          </div>
        </div>

        {/* Connection Status */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiSlack className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Slack Connection</span>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Connected
              </span>
            </div>
            <p className="text-xs text-purple-700 mt-2">
              Receiving notifications in #quality-alerts
            </p>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiMessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Teams Connection</span>
              </div>
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                Pending
              </span>
            </div>
            <p className="text-xs text-blue-700 mt-2">
              Awaiting Teams integration setup
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {[
        { label: 'Push Notifications', value: notifications, onChange: setNotifications },
        { label: 'Email Updates', value: emailUpdates, onChange: setEmailUpdates }
      ].map((item, index) => (
        <div key={index} className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            {item.label}
          </label>
          <button
            onClick={() => item.onChange(!item.value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              item.value ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                item.value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Dark Mode
        </label>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            darkMode ? 'bg-blue-500' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              darkMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account preferences and system configuration</p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
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

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'system' ? (
          <SystemConfiguration />
        ) : activeTab === 'password' ? (
          <PasswordSettings />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                {React.createElement(tabs.find(t => t.id === activeTab)?.icon, { className: "w-5 h-5 text-blue-600" })}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
            </div>

            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'notifications' && renderNotificationsTab()}
            {activeTab === 'appearance' && renderAppearanceTab()}

            {activeTab !== 'system' && activeTab !== 'password' && (
              <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                <button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium">
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Settings;