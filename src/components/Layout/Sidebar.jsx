import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome, FiFileText, FiBarChart3, FiSettings, FiX, FiClipboard, FiTrendingUp, FiShield,
  FiEye, FiAlertTriangle, FiSearch, FiUser, FiActivity, FiCheckCircle, FiTarget,
  FiLayers, FiArchive, FiChevronDown, FiChevronRight, FiClock
} from 'react-icons/fi';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiHome, path: '/dashboard' },
  { id: 'investigation', label: 'New Investigation', icon: FiClipboard, path: '/investigation', hasSubsteps: true },
  { id: 'audit-trail', label: 'Audit Trail', icon: FiClock, path: '/audit-trail' },
  { id: 'reports', label: 'Report Generator', icon: FiFileText, path: '/reports' },
  { id: 'analytics', label: 'Analytics & Trending', icon: FiTrendingUp, path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: FiSettings, path: '/settings' },
];

const investigationProcessSteps = [
  { id: 'step1', label: 'Event Discovery', icon: FiEye, path: '/investigation/event-discovery' },
  { id: 'step2', label: 'Triage & Immediate Actions', icon: FiAlertTriangle, path: '/investigation/triage' },
  { id: 'step3', label: 'Notification & Documentation', icon: FiFileText, path: '/investigation/notification' },
  { id: 'step4', label: 'Preliminary Review', icon: FiSearch, path: '/investigation/preliminary-review' },
  { id: 'step5', label: 'Investigation Initiation', icon: FiClipboard, path: '/investigation/investigation-initiation' },
  { id: 'step6', label: 'Data Collection', icon: FiActivity, path: '/investigation/data-collection' },
  { id: 'step7', label: 'Root Cause Analysis', icon: FiTarget, path: '/investigation/root-cause-analysis' },
  { id: 'step8', label: 'CAPA Determination', icon: FiLayers, path: '/investigation/capa-determination' },
  { id: 'step9', label: 'Quality Review & Approval', icon: FiShield, path: '/investigation/quality-review' },
  { id: 'step10', label: 'CAPA Execution', icon: FiCheckCircle, path: '/investigation/capa-execution' },
  { id: 'step11', label: 'Closure', icon: FiArchive, path: '/investigation/closure' },
  { id: 'step12', label: 'Trending & Improvement', icon: FiTrendingUp, path: '/investigation/trending' },
];

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [investigationExpanded, setInvestigationExpanded] = useState(
    location.pathname.startsWith('/investigation/')
  );

  const toggleInvestigationExpansion = () => {
    setInvestigationExpanded(!investigationExpanded);
  };

  const isInvestigationActive = location.pathname.startsWith('/investigation');

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
        initial={{ x: -288 }}
        animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -288 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 lg:hidden">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 lg:mt-8">
          {/* Main Navigation */}
          <div className="px-4 mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Investigation Workflow
            </h3>
          </div>

          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.hasSubsteps 
                ? isInvestigationActive 
                : location.pathname === item.path;

              return (
                <li key={item.id}>
                  {item.hasSubsteps ? (
                    <>
                      {/* Main Investigation Item */}
                      <div className="space-y-1">
                        <div
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 cursor-pointer ${
                            isActive 
                              ? 'bg-blue-50 text-blue-700' 
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <NavLink
                            to={item.path}
                            onClick={onClose}
                            className="flex items-center space-x-3 flex-1"
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                          </NavLink>
                          <button
                            onClick={toggleInvestigationExpansion}
                            className="p-1 rounded hover:bg-gray-200 transition-colors"
                          >
                            {investigationExpanded ? (
                              <FiChevronDown className="w-4 h-4" />
                            ) : (
                              <FiChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Investigation Process Steps - Substeps */}
                        {investigationExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4"
                          >
                            <div className="mb-2">
                              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Process Steps
                              </h4>
                            </div>
                            {investigationProcessSteps.map((step, index) => {
                              const StepIcon = step.icon;
                              const isStepActive = location.pathname === step.path;

                              return (
                                <NavLink
                                  key={step.id}
                                  to={step.path}
                                  onClick={onClose}
                                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                                    isStepActive
                                      ? 'bg-green-50 text-green-700 border-r-4 border-green-500'
                                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                  }`}
                                >
                                  <div className="flex items-center space-x-3">
                                    <span className="text-xs font-medium text-gray-500 w-6">
                                      {index + 1}
                                    </span>
                                    <StepIcon className="w-4 h-4" />
                                  </div>
                                  <span className="text-sm font-medium">{step.label}</span>
                                </NavLink>
                              );
                            })}
                          </motion.div>
                        )}
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2024 QualiWrite™</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;