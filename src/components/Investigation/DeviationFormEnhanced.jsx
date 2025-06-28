import React, { useState } from 'react';
import { motion } from 'framer-motion';
import StepIndicator from './StepIndicator';
import FormNavigation from './FormNavigation';
import BasicInfoStepConfigurable from './steps/BasicInfoStepConfigurable';
import RiskAssessmentStep from './steps/RiskAssessmentStep';
import ProblemStatementStep from './steps/ProblemStatementStep';
import RootCauseStep from './steps/RootCauseStep';
import ContainmentStep from './steps/ContainmentStep';
import CapaStep from './steps/CapaStep';
import TrendingStep from './steps/TrendingStep';
import { useDeviation } from '../../context/DeviationContext';

const steps = [
  { id: 'basic', title: 'Basic Information', component: BasicInfoStepConfigurable },
  { id: 'risk', title: 'Risk Assessment', component: RiskAssessmentStep },
  { id: 'problem', title: 'Problem Statement', component: ProblemStatementStep },
  { id: 'root-cause', title: 'Root Cause Analysis', component: RootCauseStep },
  { id: 'containment', title: 'Containment Actions', component: ContainmentStep },
  { id: 'capa', title: 'CAPA Development', component: CapaStep },
  { id: 'trending', title: 'Trending Analysis', component: TrendingStep }
];

function DeviationFormEnhanced() {
  const { currentStep, setCurrentStep, formData, saveDeviation } = useDeviation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleNext = () => {
    // Mark current step as completed
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex);
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
              FDA 21 CFR 210/211 Compliant Investigation Workflow
            </p>
          </div>

          {/* Step Indicator */}
          <StepIndicator 
            steps={steps} 
            currentStep={currentStep} 
            completedSteps={completedSteps}
          />

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

export default DeviationFormEnhanced;