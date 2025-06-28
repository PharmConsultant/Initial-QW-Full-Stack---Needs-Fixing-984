import React from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';
import { FiCheckCircle, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

function ProblemStatementStep() {
  const { formData, updateFormData } = useDeviation();
  const data = formData.problemStatement || {};
  const basicInfoData = formData.basicInfo || {};

  const handleChange = (field, value) => {
    updateFormData('problemStatement', { [field]: value });
  };

  // Check if AI-generated problem statement exists from Basic Info step
  const hasGeneratedStatement = basicInfoData.generatedProblemStatement;

  // Import the generated problem statement if it exists and current step is empty
  const importGeneratedStatement = () => {
    if (hasGeneratedStatement) {
      handleChange('detailedStatement', basicInfoData.generatedProblemStatement);
      // Parse the generated statement to populate individual fields
      handleChange('who', basicInfoData.whoDiscovered || '');
      handleChange('what', basicInfoData.whatHappened || '');
      handleChange('when', basicInfoData.whenOccurred || '');
      handleChange('where', basicInfoData.whereOccurred || '');
      handleChange('how', basicInfoData.howOccurred || '');
    }
  };

  // Gateway G3 Check
  const checkCompleteness = () => {
    const required = ['who', 'what', 'when', 'where', 'how'];
    return required.every(field => data[field] && data[field].trim());
  };

  const isComplete = checkCompleteness();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Import Generated Statement */}
      {hasGeneratedStatement && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-green-900 mb-1">
                AI-Generated Problem Statement Available
              </h4>
              <p className="text-sm text-green-800">
                Import the problem statement generated from your basic information for further refinement.
              </p>
            </div>
            <button
              onClick={importGeneratedStatement}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Import Generated Statement</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who (Person/Department Involved) *
          </label>
          <input
            type="text"
            value={data.who || ''}
            onChange={(e) => handleChange('who', e.target.value)}
            className="form-input"
            placeholder="Operator, QC Analyst, Production Team..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What (Specific Event/Issue) *
          </label>
          <input
            type="text"
            value={data.what || ''}
            onChange={(e) => handleChange('what', e.target.value)}
            className="form-input"
            placeholder="Temperature excursion, Documentation error..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            When (Date and Time) *
          </label>
          <input
            type="datetime-local"
            value={data.when || ''}
            onChange={(e) => handleChange('when', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where (Location/Equipment) *
          </label>
          <input
            type="text"
            value={data.where || ''}
            onChange={(e) => handleChange('where', e.target.value)}
            className="form-input"
            placeholder="Cold storage room 2, Tablet press #3..."
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How (Manner of Occurrence) *
        </label>
        <textarea
          value={data.how || ''}
          onChange={(e) => handleChange('how', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Describe how the deviation occurred..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Problem Statement
        </label>
        <textarea
          value={data.detailedStatement || ''}
          onChange={(e) => handleChange('detailedStatement', e.target.value)}
          className="form-textarea"
          rows="6"
          placeholder="Comprehensive problem statement incorporating all 5W1H elements..."
        />
        <p className="text-xs text-gray-500 mt-2">
          This field can be populated with the AI-generated problem statement from the previous step.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Evidence Collected
        </label>
        <textarea
          value={data.evidence || ''}
          onChange={(e) => handleChange('evidence', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="List all evidence, documents, photos, samples collected..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Witnesses/Additional Personnel Involved
        </label>
        <textarea
          value={data.witnesses || ''}
          onChange={(e) => handleChange('witnesses', e.target.value)}
          className="form-textarea"
          rows="2"
          placeholder="Names and roles of witnesses or other personnel involved..."
        />
      </div>

      {/* Gateway G3 Check */}
      <div className={`p-4 rounded-lg border ${
        isComplete 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center space-x-2 mb-2">
          {isComplete ? (
            <FiCheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <FiAlertTriangle className="w-5 h-5 text-red-600" />
          )}
          <h4 className={`text-sm font-semibold ${
            isComplete ? 'text-green-900' : 'text-red-900'
          }`}>
            Gateway G3: Problem Statement Completeness Check
          </h4>
        </div>
        <div className={`text-sm ${
          isComplete ? 'text-green-800' : 'text-red-800'
        }`}>
          {isComplete ? (
            <p>✓ All required fields (Who, What, When, Where, How) are completed.</p>
          ) : (
            <p>⚠ Complete all 5W1H fields before proceeding to Root Cause Analysis.</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ProblemStatementStep;