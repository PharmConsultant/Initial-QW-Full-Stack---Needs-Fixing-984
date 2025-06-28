import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiTarget, FiUsers, FiTrendingUp, FiShield, FiChevronRight, FiChevronLeft, FiCheck } from 'react-icons/fi';

function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const onboardingSteps = [
    {
      id: 'role',
      title: 'What is your role?',
      description: 'Help us personalize your experience',
      type: 'single',
      options: [
        { value: 'qa-investigator', label: 'QA Investigator', description: 'Conduct deviation investigations' },
        { value: 'qa-manager', label: 'QA Manager', description: 'Oversee quality assurance processes' },
        { value: 'production-supervisor', label: 'Production Supervisor', description: 'Manage manufacturing operations' },
        { value: 'regulatory-affairs', label: 'Regulatory Affairs', description: 'Ensure compliance and submissions' },
        { value: 'quality-engineer', label: 'Quality Engineer', description: 'Design and improve quality systems' }
      ]
    },
    {
      id: 'experience',
      title: 'Experience Level',
      description: 'How familiar are you with deviation investigations?',
      type: 'single',
      options: [
        { value: 'beginner', label: 'Beginner', description: 'New to deviation investigations' },
        { value: 'intermediate', label: 'Intermediate', description: '1-3 years experience' },
        { value: 'advanced', label: 'Advanced', description: '3+ years experience' },
        { value: 'expert', label: 'Expert', description: 'Subject matter expert' }
      ]
    },
    {
      id: 'preferences',
      title: 'Dashboard Preferences',
      description: 'What would you like to see on your dashboard?',
      type: 'multiple',
      options: [
        { value: 'recent-deviations', label: 'Recent Deviations', description: 'Latest investigation updates' },
        { value: 'analytics', label: 'Analytics & Trends', description: 'Data insights and patterns' },
        { value: 'compliance-status', label: 'Compliance Status', description: 'Regulatory compliance metrics' },
        { value: 'team-performance', label: 'Team Performance', description: 'Team productivity metrics' },
        { value: 'alerts', label: 'Priority Alerts', description: 'Important notifications' }
      ]
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      description: 'How would you like to be notified?',
      type: 'multiple',
      options: [
        { value: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
        { value: 'in-app', label: 'In-App Notifications', description: 'Browser notifications' },
        { value: 'critical-only', label: 'Critical Only', description: 'Only urgent notifications' },
        { value: 'daily-digest', label: 'Daily Digest', description: 'Summary email once per day' }
      ]
    }
  ];

  const handleAnswer = (questionId, value, isMultiple = false) => {
    setAnswers(prev => {
      if (isMultiple) {
        const currentAnswers = prev[questionId] || [];
        const newAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter(a => a !== value)
          : [...currentAnswers, value];
        return { ...prev, [questionId]: newAnswers };
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // Save onboarding data
    localStorage.setItem('onboardingData', JSON.stringify(answers));
    localStorage.removeItem('isNewUser');
    navigate('/dashboard');
  };

  const currentQuestion = onboardingSteps[currentStep];
  const isCurrentStepAnswered = currentQuestion.type === 'multiple' 
    ? (answers[currentQuestion.id] && answers[currentQuestion.id].length > 0)
    : !!answers[currentQuestion.id];

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Visual/Branding */}
      <motion.div 
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-blue-600 to-purple-700 relative overflow-hidden"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        {/* Animated floating elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-green-300/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-300/40 rounded-full blur-lg animate-pulse delay-500"></div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FiTarget className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Let's Get Started!</h1>
                <p className="text-blue-100">Personalizing your experience</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Setting Up Your
              <span className="block text-green-200">Investigation Workspace</span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              We'll customize QualiWrite™ to match your role, preferences, and 
              compliance requirements for optimal productivity.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: FiShield, text: 'Configure compliance preferences' },
                { icon: FiUsers, text: 'Set up team collaboration' },
                { icon: FiTrendingUp, text: 'Customize analytics dashboard' }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-blue-50">{step.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Progress indicator */}
            <motion.div 
              className="mt-12 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Setup Progress</span>
                <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <motion.div 
                  className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section - Onboarding Component */}
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
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
                <FiTarget className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">Setup</h1>
                <p className="text-gray-600">QualiWrite™ Onboarding</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentQuestion.title}
              </h2>
              <p className="text-gray-600">
                {currentQuestion.description}
              </p>
            </div>

            {/* Question Content */}
            <div className="space-y-4 mb-8" style={{ minHeight: '300px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = currentQuestion.type === 'multiple'
                      ? (answers[currentQuestion.id] || []).includes(option.value)
                      : answers[currentQuestion.id] === option.value;

                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => handleAnswer(currentQuestion.id, option.value, currentQuestion.type === 'multiple')}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{option.label}</h4>
                            <p className="text-sm text-gray-600">{option.description}</p>
                          </div>
                          {isSelected && (
                            <FiCheck className="w-5 h-5 text-blue-600 ml-3" />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!isCurrentStepAnswered}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>{currentStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}</span>
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>This setup will only take a few minutes</p>
            <p className="mt-1">
              You can always change these preferences later in Settings
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default OnboardingPage;