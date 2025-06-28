import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiShield, FiActivity, FiCheckCircle, FiMail, FiLock, FiEye, FiEyeOff, FiAlertTriangle } from 'react-icons/fi';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false
  });

  // Password validation function
  const validatePassword = (password) => {
    const requirements = {
      length: password.length >= 15,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
    setPasswordRequirements(requirements);
    return Object.values(requirements).every(req => req);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePassword(formData.password)) {
      alert('Password does not meet security requirements');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock authentication logic
      const isNewUser = formData.email.includes('new') || formData.email === 'new@example.com';
      const userData = {
        userId: `user-${Date.now()}`,
        token: `token-${Date.now()}`,
        newUser: isNewUser,
        email: formData.email,
        passwordLastChanged: new Date().toISOString(),
        passwordExpiryDays: 90 // Configurable in admin settings
      };

      login(userData);

      // Navigate based on user status
      if (isNewUser) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'password') {
      validatePassword(value);
    }
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-blue-300/30 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-300/40 rounded-full blur-lg"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FiShield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">QualiWrite™</h1>
                <p className="text-blue-100">Accelerating Quality Through Intelligent Compliance</p>
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Welcome to the Future of
              <span className="block text-blue-200">Deviation Investigation</span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              AI-powered pharmaceutical quality management platform designed for regulatory compliance and operational excellence.
            </p>

            <div className="space-y-4">
              {[
                { icon: FiShield, text: 'FDA 21 CFR 210/211 Compliant' },
                { icon: FiActivity, text: 'Real-time Investigation Tracking' },
                { icon: FiCheckCircle, text: 'ALCOA++ Data Integrity' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-blue-50">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <FiShield className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">QualiWrite™</h1>
                <p className="text-gray-600">Accelerating Quality Through Intelligent Compliance</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your investigation dashboard
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="form-input pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="form-input pl-10 pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-xs font-semibold text-gray-700 mb-2">Password Requirements:</h4>
                    <div className="space-y-1 text-xs">
                      <div className={`flex items-center space-x-2 ${passwordRequirements.length ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordRequirements.length ? '✓' : '✗'}</span>
                        <span>At least 15 characters</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordRequirements.uppercase ? '✓' : '✗'}</span>
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordRequirements.lowercase ? '✓' : '✗'}</span>
                        <span>One lowercase letter</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.number ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordRequirements.number ? '✓' : '✗'}</span>
                        <span>One number</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${passwordRequirements.symbol ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordRequirements.symbol ? '✓' : '✗'}</span>
                        <span>One symbol (!@#$%^&*)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading || !allRequirementsMet}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Password Expiry Notice */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
                <h4 className="text-sm font-semibold text-yellow-900">Security Notice</h4>
              </div>
              <p className="text-xs text-yellow-800">
                Passwords expire every 90 days for security compliance. You will be notified 7 days before expiration.
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials</h4>
              <div className="text-xs text-blue-800 space-y-1">
                <p><strong>Existing User:</strong> user@example.com / SecurePass123!@#$</p>
                <p><strong>New User:</strong> new@example.com / NewUserPass456!@#</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Secure authentication for pharmaceutical compliance
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>© 2024 QualiWrite™. All rights reserved.</p>
            <p className="mt-1">
              Innovation by Tidal Blue Holdings, LLC
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;