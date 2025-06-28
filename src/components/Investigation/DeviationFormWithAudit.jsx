import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import FormNavigation from './FormNavigation';
import AuditTrailViewer from '../AuditTrail/AuditTrailViewer';
import BasicInfoStepWithAudit from './steps/BasicInfoStepWithAudit';
import RiskAssessmentStep from './steps/RiskAssessmentStep';
import ProblemStatementStep from './steps/ProblemStatementStep';
import RootCauseStep from './steps/RootCauseStep';
import ContainmentStep from './steps/ContainmentStep';
import CapaStep from './steps/CapaStep';
import TrendingStep from './steps/TrendingStep';
import { useDeviation } from '../../context/DeviationContext';
import { useAuditTrail } from '../../hooks/useAuditTrail';
import { FiClock, FiEye } from 'react-icons/fi';

const steps = [
  { id: 'basic', title: 'Basic Information', component: BasicInfoStepWithAudit },
  { id: 'risk', title: 'Risk Assessment', component: RiskAssessmentStep },
  { id: 'problem', title: 'Problem Statement', component: ProblemStatementStep },
  { id: 'root-cause', title: 'Root Cause Analysis', component: RootCauseStep },
  { id: 'containment', title: 'Containment Actions', component: ContainmentStep },
  { id: 'capa', title: 'CAPA Development', component: CapaStep },
  { id: 'trending', title: 'Trending Analysis', component: TrendingStep }
];

function DeviationFormWithAudit() {
  const { deviationId } = useParams();
  const { currentStep, setCurrentStep, formData, saveDeviation, currentDeviation, setCurrentDeviation } = useDeviation();
  const { logView, logStatusChange } = useAuditTrail(currentDeviation?.id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  // Initialize deviation if deviationId is provided
  useEffect(() => {
    if (deviationId && !currentDeviation) {
      // In real app, would load from API
      const mockDeviation = {
        id: deviationId,
        title: 'Temperature Excursion Investigation',
        status: 'In Progress',
        createdAt: new Date().toISOString()
      };
      setCurrentDeviation(mockDeviation);
    }
  }, [deviationId, currentDeviation, setCurrentDeviation]);

  // Log page view
  useEffect(() => {
    if (currentDeviation?.id) {
      logView('Investigation Form');
    }
  }, [currentDeviation, logView]);

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Log step progression
      if (currentDeviation?.id) {
        logView(`Step ${currentStep + 2}: ${steps[currentStep + 1].title}`);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      
      // Log step navigation
      if (currentDeviation?.id) {
        logView(`Step ${currentStep}: ${steps[currentStep - 1].title}`);
      }
    }
  };

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
    
    // Log step navigation
    if (currentDeviation?.id) {
      logView(`Step ${stepIndex + 1}: ${steps[stepIndex].title}`);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const deviationData = {
        ...formData,
        status: 'Draft',
        completedSteps: steps.length,
        lastModified: new Date().toISOString()
      };

      // Log status change
      if (currentDeviation?.id) {
        logStatusChange(
          'In Progress',
          'Draft',
          'Investigation completed and saved as draft for review'
        );
      }

      saveDeviation(deviationData);
      alert('Investigation saved successfully!');
    } catch (error) {
      console.error('Error saving investigation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Deviation Investigation Form
            </h1>
            <p className="mt-2 text-gray-600">
              FDA 21 CFR 210/211 Compliant Investigation Workflow with Full Audit Trail
            </p>
            {currentDeviation && (
              <div className="mt-4 flex items-center justify-center space-x-4">
                <span className="text-sm text-gray-600">
                  Investigation ID: <strong>{currentDeviation.id}</strong>
                </span>
                <button
                  onClick={() => setShowAuditTrail(!showAuditTrail)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <FiEye className="w-4 h-4" />
                  <span>{showAuditTrail ? 'Hide' : 'View'} Audit Trail</span>
                </button>
              </div>
            )}
          </div>

          {/* Step Indicator */}
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep} 
            completedSteps={completedSteps} 
          />

          {/* Audit Trail Toggle */}
          {showAuditTrail && currentDeviation?.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AuditTrailViewer deviationId={currentDeviation.id} />
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Form Navigation Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <FormNavigation
                  steps={steps}
                  currentStep={currentStep}
                  onStepChange={handleStepChange}
                  completedSteps={completedSteps}
                />
                
                {/* Audit Trail Summary */}
                {currentDeviation?.id && (
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiClock className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Audit Trail</h3>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>All changes tracked</p>
                      <p>FDA 21 CFR Part 11 compliant</p>
                      <p>ALCOA+ data integrity</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {steps[currentStep].title}
                    </h2>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Step {currentStep + 1} of {steps.length}</span>
                      {completedSteps.includes(currentStep) && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-1 bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <CurrentStepComponent />

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-200">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="space-x-3">
                    {currentStep === steps.length - 1 ? (
                      <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {isSubmitting ? 'Saving...' : 'Complete Investigation'}
                      </button>
                    ) : (
                      <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DeviationFormWithAudit;