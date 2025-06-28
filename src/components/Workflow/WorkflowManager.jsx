import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiCheck, FiClock, FiUser, FiAlertTriangle } from 'react-icons/fi'
import workflowService from '../../services/workflowService'
import supabaseService from '../../services/supabaseService'

function WorkflowManager({ deviationId }) {
  const [workflowInstance, setWorkflowInstance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [advancing, setAdvancing] = useState(false)

  useEffect(() => {
    loadWorkflowInstance()
  }, [deviationId])

  const loadWorkflowInstance = async () => {
    try {
      const result = await supabaseService.getWorkflowByDeviation(deviationId)
      if (result.success) {
        setWorkflowInstance(result.data)
      }
    } catch (error) {
      console.error('Load workflow error:', error)
    } finally {
      setLoading(false)
    }
  }

  const startWorkflow = async () => {
    try {
      setLoading(true)
      const user = await supabaseService.getCurrentUser()
      const result = await workflowService.startWorkflow(
        'deviation_investigation',
        deviationId,
        user.data.id
      )
      
      if (result.success) {
        setWorkflowInstance(result.data)
      }
    } catch (error) {
      console.error('Start workflow error:', error)
    } finally {
      setLoading(false)
    }
  }

  const advanceWorkflow = async (comments = '') => {
    try {
      setAdvancing(true)
      const user = await supabaseService.getCurrentUser()
      const result = await workflowService.advanceWorkflow(
        workflowInstance.id,
        user.data.id,
        comments
      )
      
      if (result.success) {
        setWorkflowInstance(result.data)
      } else {
        alert(result.error)
      }
    } catch (error) {
      console.error('Advance workflow error:', error)
    } finally {
      setAdvancing(false)
    }
  }

  const getStepStatus = (stepId) => {
    if (!workflowInstance) return 'pending'
    
    const workflowDef = workflowService.workflowDefinitions.get(
      workflowInstance.workflow_definition_id
    )
    
    const stepIndex = workflowDef.steps.findIndex(s => s.id === stepId)
    const currentIndex = workflowDef.steps.findIndex(s => s.id === workflowInstance.current_step)
    
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  const isOverdue = () => {
    if (!workflowInstance || !workflowInstance.due_date) return false
    return new Date(workflowInstance.due_date) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!workflowInstance) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <FiPlay className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Active Workflow
          </h3>
          <p className="text-gray-600 mb-4">
            Start the investigation workflow to begin the structured process
          </p>
          <button
            onClick={startWorkflow}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Investigation Workflow
          </button>
        </div>
      </div>
    )
  }

  const workflowDef = workflowService.workflowDefinitions.get(
    workflowInstance.workflow_definition_id
  )

  return (
    <div className="space-y-6">
      {/* Workflow Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {workflowDef.name}
            </h3>
            <p className="text-sm text-gray-600">
              Status: <span className="font-medium">{workflowInstance.status}</span>
            </p>
          </div>
          <div className="text-right">
            {isOverdue() && (
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <FiAlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Overdue</span>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Due: {new Date(workflowInstance.due_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Investigation Steps</h4>
        
        <div className="space-y-4">
          {workflowDef.steps.map((step, index) => {
            const status = getStepStatus(step.id)
            const isActive = status === 'active'
            const isCompleted = status === 'completed'
            
            return (
              <motion.div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg border ${
                  isActive
                    ? 'border-blue-300 bg-blue-50'
                    : isCompleted
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                  ) : isActive ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiClock className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h5 className="font-medium text-gray-900">{step.name}</h5>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <FiUser className="w-3 h-3" />
                      <span>Required: {step.requiredRole.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-3 h-3" />
                      <span>{step.timelineHours}h timeline</span>
                    </div>
                  </div>
                </div>
                
                {isActive && (
                  <button
                    onClick={() => advanceWorkflow()}
                    disabled={advancing}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {advancing ? 'Processing...' : 'Complete Step'}
                  </button>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Progress</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Overall Progress</span>
            <span>
              {workflowDef.steps.findIndex(s => s.id === workflowInstance.current_step) + 1} of {workflowDef.steps.length} steps
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${
                  ((workflowDef.steps.findIndex(s => s.id === workflowInstance.current_step) + 1) /
                    workflowDef.steps.length) *
                  100
                }%`
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Started:</span>
              <span className="ml-2 font-medium">
                {new Date(workflowInstance.initiated_at).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Current Step Due:</span>
              <span className="ml-2 font-medium">
                {new Date(workflowInstance.due_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkflowManager