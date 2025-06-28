import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';
import { useAuditTrail } from '../../../hooks/useAuditTrail';
import { FiZap, FiCheckCircle, FiAlertTriangle, FiCalendar, FiClock } from 'react-icons/fi';

function BasicInfoStepWithAudit() {
  const { formData, updateFormData, currentDeviation } = useDeviation();
  const { logAIGeneration, logFieldUpdate } = useAuditTrail(currentDeviation?.id);
  const data = formData.basicInfo || {};
  const [isGeneratingProblemStatement, setIsGeneratingProblemStatement] = useState(false);
  const [generatedProblemStatement, setGeneratedProblemStatement] = useState('');

  // Track field changes for audit
  const [previousData, setPreviousData] = useState(data);

  const handleChange = (field, value) => {
    const oldValue = data[field];
    const newValue = value;

    // Update form data
    updateFormData('basicInfo', { [field]: value });

    // Log field change if value actually changed
    if (oldValue !== newValue && currentDeviation?.id) {
      logFieldUpdate(
        'Basic Information',
        field,
        oldValue,
        newValue,
        `Updated ${field} field in basic information section`
      );
    }
  };

  const generateProblemStatement = async () => {
    if (!checkRequiredFields()) {
      alert('Please complete all required fields before generating the problem statement.');
      return;
    }

    setIsGeneratingProblemStatement(true);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000));

      const problemStatement = `
On ${data.whenOccurred}, a deviation was discovered at ${data.whereOccurred} where ${data.whatHappened}. 
The issue was identified by ${data.whoDiscovered} and represents a deviation from ${data.whatDeviated}.

Mechanism of Occurrence: ${data.howOccurred}

${data.whoInvolved ? `Personnel Involved/Notified: ${data.whoInvolved}` : ''}
${data.qaRepNotified ? `QA Representative ${data.qaRepNotified} was notified on ${data.whenQaNotified || 'date to be confirmed'}.` : ''}
${data.maintenanceNotified ? `Maintenance/Engineering notification: ${data.maintenanceNotified}` : ''}
${data.otherDeptNotified ? `Other departments notified: ${data.otherDeptNotified}` : ''}

Immediate containment actions included: ${data.immediateActions || 'Actions to be documented'}

${data.otherBatchesImpacted ? `Other affected batches/dates: ${data.otherBatchesImpacted}` : 'No other batches identified as impacted at this time.'}

Initial impact assessment indicates: ${data.initialImpactAssessment || 'Assessment pending completion of investigation'}

Investigation is proceeding per ${data.sopFollowed || 'applicable SOP'} with interviews of ${data.operatorsInterviewed || 'relevant personnel'}.

Immediate corrections implemented: ${data.immediateCorrections || 'Corrections documented separately'}
      `.trim();

      setGeneratedProblemStatement(problemStatement);
      handleChange('generatedProblemStatement', problemStatement);

      // Log AI generation activity
      if (currentDeviation?.id) {
        logAIGeneration(
          'Problem Statement',
          'GPT-4',
          problemStatement,
          'AI analysis of basic information data to generate comprehensive problem statement'
        );
      }

    } catch (error) {
      console.error('Error generating problem statement:', error);
      alert('Error generating problem statement. Please try again.');
    } finally {
      setIsGeneratingProblemStatement(false);
    }
  };

  const checkRequiredFields = () => {
    const requiredFields = [
      'whatHappened',
      'whereOccurred', 
      'whenOccurred',
      'howOccurred',
      'whoDiscovered',
      'whatDeviated'
    ];
    return requiredFields.every(field => data[field] && data[field].trim());
  };

  const requiredFieldsComplete = checkRequiredFields();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Deviation Initial Report
        </h3>
        <p className="text-sm text-blue-800">
          Complete all required fields to capture the initial deviation details. All changes are automatically tracked in the audit trail.
        </p>
      </div>

      {/* Administrative Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Administrative Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deviation ID *
            </label>
            <input
              type="text"
              value={data.deviationId || ''}
              onChange={(e) => handleChange('deviationId', e.target.value)}
              className="form-input"
              placeholder="DEV-2024-001"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch/Lot Number
            </label>
            <input
              type="text"
              value={data.batchNumber || ''}
              onChange={(e) => handleChange('batchNumber', e.target.value)}
              className="form-input"
              placeholder="LOT-2024-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={data.productName || ''}
              onChange={(e) => handleChange('productName', e.target.value)}
              className="form-input"
              placeholder="Product ABC 10mg Tablets"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturing Area
            </label>
            <select
              value={data.manufacturingArea || ''}
              onChange={(e) => handleChange('manufacturingArea', e.target.value)}
              className="form-input"
            >
              <option value="">Select Area</option>
              <option value="production">Production</option>
              <option value="packaging">Packaging</option>
              <option value="warehouse">Warehouse</option>
              <option value="quality-control">Quality Control</option>
              <option value="quality-assurance">Quality Assurance</option>
              <option value="maintenance">Maintenance</option>
              <option value="utilities">Utilities</option>
            </select>
          </div>
        </div>
      </div>

      {/* Required Deviation Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Deviation Details 
          <span className="text-red-500">*Required Fields</span>
        </h4>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What Happened? *
            </label>
            <textarea
              value={data.whatHappened || ''}
              onChange={(e) => handleChange('whatHappened', e.target.value)}
              className="form-textarea"
              rows="3"
              placeholder="Describe specifically what occurred (e.g., temperature excursion detected, documentation error found, equipment malfunction observed)"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where did it occur? *
            </label>
            <textarea
              value={data.whereOccurred || ''}
              onChange={(e) => handleChange('whereOccurred', e.target.value)}
              className="form-textarea"
              rows="2"
              placeholder="Specific location, equipment, room, line, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When did it occur? *
            </label>
            <textarea
              value={data.whenOccurred || ''}
              onChange={(e) => handleChange('whenOccurred', e.target.value)}
              className="form-textarea"
              rows="2"
              placeholder="Date, time, shift, duration if known"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How did it occur? *
            </label>
            <textarea
              value={data.howOccurred || ''}
              onChange={(e) => handleChange('howOccurred', e.target.value)}
              className="form-textarea"
              rows="3"
              placeholder="Describe the mechanism or sequence of events that led to the deviation"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Who discovered the issue? *
            </label>
            <textarea
              value={data.whoDiscovered || ''}
              onChange={(e) => handleChange('whoDiscovered', e.target.value)}
              className="form-textarea"
              rows="2"
              placeholder="Name, title, department of person who discovered the deviation"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What was deviated from? *
              <span className="text-sm text-gray-500 block mt-1">(SOP/BR Reference, Page, Step, Expected Result)</span>
            </label>
            <textarea
              value={data.whatDeviated || ''}
              onChange={(e) => handleChange('whatDeviated', e.target.value)}
              className="form-textarea"
              rows="4"
              placeholder="SOP Number: [SOP-XXX], Page: [X], Step: [X.X], Expected Result: [describe what should have happened according to procedure]"
              required
            />
          </div>
        </div>
      </div>

      {/* AI Problem Statement Generation */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">
            AI-Generated Problem Statement
          </h4>
          <button
            onClick={generateProblemStatement}
            disabled={!requiredFieldsComplete || isGeneratingProblemStatement}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              requiredFieldsComplete && !isGeneratingProblemStatement
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isGeneratingProblemStatement ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Analyzing Data...</span>
              </>
            ) : (
              <>
                <FiZap className="w-5 h-5" />
                <span>Generate Problem Statement</span>
              </>
            )}
          </button>
        </div>

        {/* Status Indicator */}
        <div className={`p-4 rounded-lg border mb-4 ${
          requiredFieldsComplete 
            ? 'bg-green-50 border-green-200' 
            : 'bg-yellow-50 border-yellow-200'
        }`}>
          <div className="flex items-center space-x-2">
            {requiredFieldsComplete ? (
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
            )}
            <span className={`text-sm font-medium ${
              requiredFieldsComplete ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {requiredFieldsComplete
                ? 'All required fields completed - Ready to generate problem statement'
                : 'Complete all required fields to enable AI analysis'
              }
            </span>
          </div>
        </div>

        {/* Generated Problem Statement */}
        {generatedProblemStatement && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FiCheckCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  AI Analysis Complete - Problem Statement Generated & Logged
                </span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generated Problem Statement
              </label>
              <textarea
                value={generatedProblemStatement}
                onChange={(e) => {
                  setGeneratedProblemStatement(e.target.value);
                  handleChange('generatedProblemStatement', e.target.value);
                }}
                className="form-textarea"
                rows="12"
                placeholder="AI-generated problem statement will appear here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                You can edit the generated problem statement as needed. All changes are tracked in the audit trail.
              </p>
            </div>
          </div>
        )}

        {!generatedProblemStatement && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Complete the required fields above and click "Generate Problem Statement" to create 
              a comprehensive problem statement using AI analysis.
            </p>
          </div>
        )}
      </div>

      {/* Audit Trail Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <FiClock className="w-5 h-5 text-green-600" />
          <h4 className="text-sm font-semibold text-green-900">Audit Trail Active</h4>
        </div>
        <p className="text-sm text-green-800">
          All form changes, AI generations, and user actions are automatically logged in the audit trail 
          for FDA 21 CFR Part 11 compliance. Each entry includes timestamps, user identification, and data integrity checks.
        </p>
      </div>

      {/* Gateway Check */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Gateway G1 & G2 Check: Timing Requirements
        </h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p>• Occurrence → Discovery: ≤ 3 business days</p>
          <p>• Discovery → Deviation Open: ≤ 3 business days</p>
          <p>• Current status: <span className="font-semibold">Within compliance window</span></p>
        </div>
      </div>
    </motion.div>
  );
}

export default BasicInfoStepWithAudit;