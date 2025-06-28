import React from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';

function ContainmentStep() {
  const { formData, updateFormData } = useDeviation();
  const data = formData.containment || {};

  const handleChange = (field, value) => {
    updateFormData('containment', { [field]: value });
  };

  const handleChecklistChange = (item, checked) => {
    const currentChecklist = data.checklist || [];
    const updatedChecklist = checked
      ? [...currentChecklist, item]
      : currentChecklist.filter(i => i !== item);
    handleChange('checklist', updatedChecklist);
  };

  const containmentItems = [
    'Quarantine affected product/batch',
    'Stop production/process',
    'Secure evidence and documentation',
    'Notify QA/QC management',
    'Notify regulatory affairs (if required)',
    'Initiate customer notification (if required)',
    'Implement temporary controls',
    'Brief relevant personnel',
    'Document all actions taken',
    'Verify containment effectiveness'
  ];

  const checkedItems = data.checklist || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Immediate Containment Actions</h4>
        <div className="space-y-3">
          {containmentItems.map((item, index) => (
            <label key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={checkedItems.includes(item)}
                onChange={(e) => handleChecklistChange(item, e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900">{item}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Detailed Containment Actions Taken *
        </label>
        <textarea
          value={data.detailedActions || ''}
          onChange={(e) => handleChange('detailedActions', e.target.value)}
          className="form-textarea"
          rows="4"
          placeholder="Describe in detail the containment actions implemented..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Containment Owner *
          </label>
          <input
            type="text"
            value={data.owner || ''}
            onChange={(e) => handleChange('owner', e.target.value)}
            className="form-input"
            placeholder="Name and Title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Containment Date/Time *
          </label>
          <input
            type="datetime-local"
            value={data.dateTime || ''}
            onChange={(e) => handleChange('dateTime', e.target.value)}
            className="form-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Affected Product/Batch Details
        </label>
        <textarea
          value={data.affectedProducts || ''}
          onChange={(e) => handleChange('affectedProducts', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="List all affected products, batches, lot numbers..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Impact Assessment
        </label>
        <select
          value={data.customerImpact || ''}
          onChange={(e) => handleChange('customerImpact', e.target.value)}
          className="form-input"
        >
          <option value="">Select Impact Level</option>
          <option value="none">No Customer Impact</option>
          <option value="potential">Potential Customer Impact</option>
          <option value="confirmed">Confirmed Customer Impact</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Regulatory Notification Required
        </label>
        <select
          value={data.regulatoryNotification || ''}
          onChange={(e) => handleChange('regulatoryNotification', e.target.value)}
          className="form-input"
        >
          <option value="">Select</option>
          <option value="yes">Yes - Notification Required</option>
          <option value="no">No - No Notification Required</option>
          <option value="pending">Pending Assessment</option>
        </select>
      </div>

      {data.regulatoryNotification === 'yes' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regulatory Bodies to Notify
          </label>
          <textarea
            value={data.regulatoryBodies || ''}
            onChange={(e) => handleChange('regulatoryBodies', e.target.value)}
            className="form-textarea"
            rows="2"
            placeholder="FDA, EMA, MHRA, Health Canada, etc."
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Containment Effectiveness Verification
        </label>
        <textarea
          value={data.effectivenessVerification || ''}
          onChange={(e) => handleChange('effectivenessVerification', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Describe how the effectiveness of containment actions was verified..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes/Comments
        </label>
        <textarea
          value={data.additionalNotes || ''}
          onChange={(e) => handleChange('additionalNotes', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Any additional information relevant to containment..."
        />
      </div>

      {/* Containment Summary */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          Containment Summary
        </h4>
        <div className="text-sm text-blue-800">
          <p>Checklist Items Completed: {checkedItems.length}/{containmentItems.length}</p>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(checkedItems.length / containmentItems.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ContainmentStep;