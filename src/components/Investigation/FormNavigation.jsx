import React from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiCheckCircle, FiClock } from 'react-icons/fi';

function FormNavigation({ steps, currentStep, onStepChange, completedSteps = [] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Investigation Progress</h3>
      
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = index === currentStep;
          const isAccessible = index <= currentStep || isCompleted;
          
          return (
            <motion.button
              key={step.id}
              onClick={() => isAccessible && onStepChange(index)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all ${
                isCurrent
                  ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                  : isCompleted
                  ? 'bg-green-50 border border-green-200 text-green-900 hover:bg-green-100'
                  : isAccessible
                  ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                  : 'bg-gray-25 border border-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={!isAccessible}
              whileHover={isAccessible ? { scale: 1.02 } : {}}
              whileTap={isAccessible ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center space-x-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? (
                    <FiCheckCircle className="w-4 h-4" />
                  ) : isCurrent ? (
                    <FiClock className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  {isCompleted && (
                    <p className="text-xs text-green-600">Completed</p>
                  )}
                  {isCurrent && (
                    <p className="text-xs text-blue-600">In Progress</p>
                  )}
                </div>
              </div>
              
              {(isCompleted || isCurrent) && (
                <FiEdit2 className="w-4 h-4 text-gray-400" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">
            {completedSteps.length} of {steps.length} completed
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

export default FormNavigation;