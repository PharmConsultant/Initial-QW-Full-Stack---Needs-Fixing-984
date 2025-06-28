import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiLock, FiShield, FiClock, FiAlertTriangle, FiSave } from 'react-icons/fi';

function PasswordSettings() {
  const [passwordPolicy, setPasswordPolicy] = useState({
    minLength: 15,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: true,
    expiryDays: 90,
    warningDays: 7,
    preventReuse: 12,
    lockoutAttempts: 5,
    lockoutDuration: 30
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });

  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= passwordPolicy.minLength,
      uppercase: passwordPolicy.requireUppercase ? /[A-Z]/.test(password) : true,
      lowercase: passwordPolicy.requireLowercase ? /[a-z]/.test(password) : true,
      number: passwordPolicy.requireNumbers ? /\d/.test(password) : true,
      symbol: passwordPolicy.requireSymbols ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) : true
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(req => req);
  };

  const handlePasswordPolicyChange = (field, value) => {
    setPasswordPolicy(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNewPasswordChange = (password) => {
    setNewPassword(password);
    validatePassword(password);
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Password & Security Settings</h3>
        <p className="text-gray-600">Configure password policies and security requirements</p>
      </motion.div>

      {/* Password Policy Configuration */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiShield className="w-5 h-5 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Password Policy Configuration</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={passwordPolicy.minLength}
              onChange={(e) => handlePasswordPolicyChange('minLength', parseInt(e.target.value))}
              className="form-input"
              min="8"
              max="50"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 15+ characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password Expiry (Days)
            </label>
            <input
              type="number"
              value={passwordPolicy.expiryDays}
              onChange={(e) => handlePasswordPolicyChange('expiryDays', parseInt(e.target.value))}
              className="form-input"
              min="30"
              max="365"
            />
            <p className="text-xs text-gray-500 mt-1">Default: 90 days for compliance</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Warning (Days)
            </label>
            <input
              type="number"
              value={passwordPolicy.warningDays}
              onChange={(e) => handlePasswordPolicyChange('warningDays', parseInt(e.target.value))}
              className="form-input"
              min="1"
              max="30"
            />
            <p className="text-xs text-gray-500 mt-1">Days before expiry to warn users</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prevent Password Reuse
            </label>
            <input
              type="number"
              value={passwordPolicy.preventReuse}
              onChange={(e) => handlePasswordPolicyChange('preventReuse', parseInt(e.target.value))}
              className="form-input"
              min="0"
              max="24"
            />
            <p className="text-xs text-gray-500 mt-1">Number of previous passwords to remember</p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h5 className="text-md font-medium text-gray-900">Password Requirements</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={passwordPolicy.requireUppercase}
                onChange={(e) => handlePasswordPolicyChange('requireUppercase', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require uppercase letters</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={passwordPolicy.requireLowercase}
                onChange={(e) => handlePasswordPolicyChange('requireLowercase', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require lowercase letters</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={passwordPolicy.requireNumbers}
                onChange={(e) => handlePasswordPolicyChange('requireNumbers', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require numbers</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={passwordPolicy.requireSymbols}
                onChange={(e) => handlePasswordPolicyChange('requireSymbols', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Require symbols (!@#$%^&*)</span>
            </label>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h5 className="text-sm font-semibold text-blue-900 mb-2">Current Policy Summary</h5>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Minimum length: {passwordPolicy.minLength} characters</p>
            <p>• Password expires every: {passwordPolicy.expiryDays} days</p>
            <p>• Warning period: {passwordPolicy.warningDays} days before expiry</p>
            <p>• Requirements: {[
              passwordPolicy.requireUppercase && 'Uppercase',
              passwordPolicy.requireLowercase && 'Lowercase', 
              passwordPolicy.requireNumbers && 'Numbers',
              passwordPolicy.requireSymbols && 'Symbols'
            ].filter(Boolean).join(', ')}</p>
          </div>
        </div>
      </motion.div>

      {/* Change Password */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiLock className="w-5 h-5 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Change Password</h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="form-input"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              className="form-input"
              placeholder="Enter new password"
            />

            {/* Password Requirements Display */}
            {newPassword && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <h5 className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center space-x-2 ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{passwordRequirements.length ? '✓' : '✗'}</span>
                    <span>At least {passwordPolicy.minLength} characters</span>
                  </div>
                  {passwordPolicy.requireUppercase && (
                    <div className={`flex items-center space-x-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordRequirements.uppercase ? '✓' : '✗'}</span>
                      <span>One uppercase letter</span>
                    </div>
                  )}
                  {passwordPolicy.requireLowercase && (
                    <div className={`flex items-center space-x-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordRequirements.lowercase ? '✓' : '✗'}</span>
                      <span>One lowercase letter</span>
                    </div>
                  )}
                  {passwordPolicy.requireNumbers && (
                    <div className={`flex items-center space-x-2 ${passwordRequirements.number ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordRequirements.number ? '✓' : '✗'}</span>
                      <span>One number</span>
                    </div>
                  )}
                  {passwordPolicy.requireSymbols && (
                    <div className={`flex items-center space-x-2 ${passwordRequirements.symbol ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{passwordRequirements.symbol ? '✓' : '✗'}</span>
                      <span>One symbol</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              placeholder="Confirm new password"
            />
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
            )}
            {passwordsMatch && confirmPassword && (
              <p className="text-xs text-green-600 mt-1">Passwords match</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            disabled={!allRequirementsMet || !passwordsMatch || !currentPassword}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiSave className="w-5 h-5" />
            <span>Update Password</span>
          </button>
        </div>
      </motion.div>

      {/* Security Status */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <FiClock className="w-5 h-5 text-yellow-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Password Status</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="text-sm font-medium text-green-900">Last Changed</h5>
            <p className="text-lg font-bold text-green-600">15 days ago</p>
            <p className="text-xs text-green-700">January 1, 2024</p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h5 className="text-sm font-medium text-yellow-900">Expires In</h5>
            <p className="text-lg font-bold text-yellow-600">75 days</p>
            <p className="text-xs text-yellow-700">March 31, 2024</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-900">Strength</h5>
            <p className="text-lg font-bold text-blue-600">Strong</p>
            <p className="text-xs text-blue-700">Meets all requirements</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
            <h5 className="text-sm font-semibold text-yellow-900">Security Reminder</h5>
          </div>
          <p className="text-sm text-yellow-800">
            Your password will expire in 75 days. You will receive notifications 7 days before expiration.
            For optimal security, consider updating your password regularly.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default PasswordSettings;