import React from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiX, FiShield } from 'react-icons/fi';

function ValidationPopup({ isOpen, onClose, onAcknowledge, validationResults }) {
  if (!isOpen) return null;

  const { isValid, errors, warnings, complianceRisk } = validationResults;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Data Validation Alert</h3>
              <p className="text-sm text-gray-600">Compliance Risk Assessment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Risk Level */}
          <div className={`p-4 rounded-lg border-2 ${
            complianceRisk === 'High' 
              ? 'bg-red-50 border-red-200' 
              : complianceRisk === 'Medium'
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <FiShield className={`w-5 h-5 ${
                complianceRisk === 'High' 
                  ? 'text-red-600' 
                  : complianceRisk === 'Medium'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`} />
              <h4 className={`font-semibold ${
                complianceRisk === 'High' 
                  ? 'text-red-900' 
                  : complianceRisk === 'Medium'
                  ? 'text-yellow-900'
                  : 'text-blue-900'
              }`}>
                Compliance Risk Level: {complianceRisk}
              </h4>
            </div>
            <p className={`text-sm ${
              complianceRisk === 'High' 
                ? 'text-red-800' 
                : complianceRisk === 'Medium'
                ? 'text-yellow-800'
                : 'text-blue-800'
            }`}>
              {complianceRisk === 'High' 
                ? 'Critical issues detected that may result in regulatory non-compliance'
                : complianceRisk === 'Medium'
                ? 'Some issues detected that should be addressed to ensure compliance'
                : 'Minor issues detected - proceed with caution'
              }
            </p>
          </div>

          {/* Validation Errors */}
          {errors.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-red-900 flex items-center space-x-2">
                <FiAlertTriangle className="w-4 h-4" />
                <span>Critical Issues ({errors.length})</span>
              </h4>
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-900">{error.field}</p>
                      <p className="text-sm text-red-800">{error.message}</p>
                      <p className="text-xs text-red-600 mt-1">Impact: {error.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-yellow-900 flex items-center space-x-2">
                <FiAlertTriangle className="w-4 h-4" />
                <span>Warnings ({warnings.length})</span>
              </h4>
              <div className="space-y-2">
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">{warning.field}</p>
                      <p className="text-sm text-yellow-800">{warning.message}</p>
                      <p className="text-xs text-yellow-600 mt-1">Recommendation: {warning.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regulatory Impact */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Regulatory Impact Assessment</h4>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• <strong>FDA 21 CFR 210/211:</strong> Issues may impact manufacturing quality standards</p>
              <p>• <strong>ALCOA++ Principles:</strong> Data integrity concerns identified</p>
              <p>• <strong>Inspection Risk:</strong> Current state may trigger regulatory observations</p>
            </div>
          </div>

          {/* Required Acknowledgment */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Required Acknowledgment</h4>
            <p className="text-sm text-blue-800 mb-3">
              By proceeding, you acknowledge that you understand the compliance risks identified and 
              will address these issues before finalizing the investigation.
            </p>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="compliance-acknowledgment"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-blue-900">
                I acknowledge the compliance risks and commit to addressing identified issues
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Review Data
          </button>
          <button
            onClick={() => {
              const checkbox = document.getElementById('compliance-acknowledgment');
              if (!checkbox.checked) {
                alert('Please acknowledge the compliance risks before proceeding.');
                return;
              }
              onAcknowledge();
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              complianceRisk === 'High'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Acknowledge & Proceed
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ValidationPopup;