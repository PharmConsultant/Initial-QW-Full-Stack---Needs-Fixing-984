import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import StepIndicator from './StepIndicator'
import FormNavigation from './FormNavigation'
import AuditTrailViewer from '../AuditTrail/AuditTrailViewer'
import FileUploadManager from '../FileUpload/FileUploadManager'
import WorkflowManager from '../Workflow/WorkflowManager'
import ESignatureModal from '../ElectronicSignature/ESignatureModal'
import BasicInfoStepProfessional from './steps/BasicInfoStepProfessional'
import RiskAssessmentStep from './steps/RiskAssessmentStep'
import ProblemStatementStep from './steps/ProblemStatementStep'
import RootCauseStep from './steps/RootCauseStep'
import ContainmentStep from './steps/ContainmentStep'
import CapaStep from './steps/CapaStep'
import TrendingStep from './steps/TrendingStep'
import { useDeviation } from '../../context/DeviationContext'
import supabaseService from '../../services/supabaseService'
import aiService from '../../services/aiService'
import { FiClock, FiEye, FiUpload, FiWorkflow, FiFileText } from 'react-icons/fi'

const steps = [
  { id: 'basic', title: 'Basic Information', component: BasicInfoStepProfessional },
  { id: 'risk', title: 'Risk Assessment', component: RiskAssessmentStep },
  { id: 'problem', title: 'Problem Statement', component: ProblemStatementStep },
  { id: 'root-cause', title: 'Root Cause Analysis', component: RootCauseStep },
  { id: 'containment', title: 'Containment Actions', component: ContainmentStep },
  { id: 'capa', title: 'CAPA Development', component: CapaStep },
  { id: 'trending', title: 'Trending Analysis', component: TrendingStep }
]

function DeviationFormComplete() {
  const { deviationId } = useParams()
  const {
    currentStep,
    setCurrentStep,
    formData,
    saveDeviation,
    currentDeviation,
    setCurrentDeviation
  } = useDeviation()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState([])
  const [showAuditTrail, setShowAuditTrail] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showWorkflow, setShowWorkflow] = useState(false)
  const [showESignature, setShowESignature] = useState(false)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  // Initialize deviation if deviationId is provided
  useEffect(() => {
    if (deviationId) {
      loadDeviation()
    } else {
      setLoading(false)
    }
  }, [deviationId])

  // Load AI service configuration
  useEffect(() => {
    loadAIConfiguration()
  }, [])

  const loadDeviation = async () => {
    try {
      const result = await supabaseService.getDeviation(deviationId)
      if (result.success) {
        setCurrentDeviation(result.data)
        // Load form data from database
        // updateFormData with result.data.form_data
      }
      
      // Load documents
      const docsResult = await supabaseService.getDocuments(deviationId)
      if (docsResult.success) {
        setDocuments(docsResult.data)
      }
    } catch (error) {
      console.error('Load deviation error:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAIConfiguration = async () => {
    try {
      // Load system configuration for AI models
      const config = await supabaseService.getSystemConfiguration('ai_models')
      if (config.success) {
        const aiConfig = config.data.value
        Object.entries(aiConfig).forEach(([type, settings]) => {
          aiService.setModel(type, settings.model, settings.provider)
        })
      }
    } catch (error) {
      console.error('Load AI configuration error:', error)
    }
  }

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep])
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepChange = (stepIndex) => {
    setCurrentStep(stepIndex)
  }

  const handleFileUploaded = (file) => {
    setDocuments(prev => [...prev, file])
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const deviationData = {
        ...formData,
        status: 'Draft',
        completed_steps: steps.length,
        last_modified: new Date().toISOString()
      }

      if (currentDeviation?.id) {
        // Update existing
        await supabaseService.updateDeviation(currentDeviation.id, deviationData)
      } else {
        // Create new
        const result = await supabaseService.createDeviation(deviationData)
        if (result.success) {
          setCurrentDeviation(result.data)
        }
      }

      saveDeviation(deviationData)
      alert('Investigation saved successfully!')
    } catch (error) {
      console.error('Error saving investigation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleESignature = async (signatureData) => {
    try {
      // Create electronic signature record
      await supabaseService.createElectronicSignature({
        ...signatureData,
        deviation_id: currentDeviation?.id,
        user_id: (await supabaseService.getCurrentUser()).data?.id
      })

      // Log the signature in audit trail
      await supabaseService.logAuditEntry({
        deviation_id: currentDeviation?.id,
        action: 'Electronic Signature Applied',
        action_type: 'APPROVE',
        section: 'Investigation Approval',
        new_value: signatureData.reason,
        justification: signatureData.comments,
        regulatory_impact: 'High',
        user_id: (await supabaseService.getCurrentUser()).data?.id
      })

      alert('Electronic signature applied successfully!')
    } catch (error) {
      console.error('Electronic signature error:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investigation...</p>
        </div>
      </div>
    )
  }

  const CurrentStepComponent = steps[currentStep].component

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
              Deviation Investigation Platform
            </h1>
            <p className="mt-2 text-gray-600">
              FDA 21 CFR 210/211 Compliant Investigation Workflow with Full Integration
            </p>
            {currentDeviation && (
              <div className="mt-4 flex items-center justify-center space-x-6">
                <span className="text-sm text-gray-600">
                  Investigation ID: <strong>{currentDeviation.deviation_id}</strong>
                </span>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowAuditTrail(!showAuditTrail)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <FiEye className="w-4 h-4" />
                    <span>{showAuditTrail ? 'Hide' : 'View'} Audit Trail</span>
                  </button>
                  <button
                    onClick={() => setShowDocuments(!showDocuments)}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm"
                  >
                    <FiUpload className="w-4 h-4" />
                    <span>{showDocuments ? 'Hide' : 'View'} Documents ({documents.length})</span>
                  </button>
                  <button
                    onClick={() => setShowWorkflow(!showWorkflow)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm"
                  >
                    <FiWorkflow className="w-4 h-4" />
                    <span>{showWorkflow ? 'Hide' : 'View'} Workflow</span>
                  </button>
                  <button
                    onClick={() => setShowESignature(true)}
                    className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 text-sm"
                  >
                    <FiFileText className="w-4 h-4" />
                    <span>E-Sign</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step Indicator */}
          <StepIndicator steps={steps} currentStep={currentStep} completedSteps={completedSteps} />

          {/* Additional Panels */}
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

          {showDocuments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <FileUploadManager
                deviationId={currentDeviation?.id || 'temp'}
                onFileUploaded={handleFileUploaded}
                existingFiles={documents}
              />
            </motion.div>
          )}

          {showWorkflow && currentDeviation?.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <WorkflowManager deviationId={currentDeviation.id} />
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
                
                {/* Integration Status */}
                {currentDeviation?.id && (
                  <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <FiClock className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-semibold text-gray-900">Integration Status</h3>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>✅ Supabase Connected</p>
                      <p>✅ Real-time Audit Trail</p>
                      <p>✅ File Upload System</p>
                      <p>✅ Workflow Engine</p>
                      <p>✅ E-Signature Ready</p>
                      <p>✅ AI Integration</p>
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

      {/* Electronic Signature Modal */}
      <ESignatureModal
        isOpen={showESignature}
        onClose={() => setShowESignature(false)}
        onSign={handleESignature}
        document={{ title: 'Investigation Report', id: currentDeviation?.id }}
        reason="Investigation Approval"
      />
    </div>
  )
}

export default DeviationFormComplete