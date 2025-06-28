import React from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

function CapaStep() {
  const { formData, updateFormData } = useDeviation();
  const data = formData.capa || {};

  const handleChange = (field, value) => {
    updateFormData('capa', { [field]: value });
  };

  const addCapaAction = () => {
    const currentActions = data.actions || [];
    const newAction = {
      id: Date.now(),
      type: 'corrective',
      description: '',
      owner: '',
      dueDate: '',
      effectivenessMetric: '',
      status: 'planned'
    };
    handleChange('actions', [...currentActions, newAction]);
  };

  const updateCapaAction = (id, field, value) => {
    const currentActions = data.actions || [];
    const updatedActions = currentActions.map(action =>
      action.id === id ? { ...action, [field]: value } : action
    );
    handleChange('actions', updatedActions);
  };

  const removeCapaAction = (id) => {
    const currentActions = data.actions || [];
    const filteredActions = currentActions.filter(action => action.id !== id);
    handleChange('actions', filteredActions);
  };

  const actions = data.actions || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CAPA Approach Justification *
        </label>
        <textarea
          value={data.approachJustification || ''}
          onChange={(e) => handleChange('approachJustification', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Explain the overall approach to corrective and preventive actions..."
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">CAPA Actions</h4>
        <button
          type="button"
          onClick={addCapaAction}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Action</span>
        </button>
      </div>

      {actions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No CAPA actions added yet. Click "Add Action" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.id}
              className="p-6 bg-gray-50 rounded-lg border border-gray-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-lg font-medium text-gray-900">
                  Action #{index + 1}
                </h5>
                <button
                  type="button"
                  onClick={() => removeCapaAction(action.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Type *
                  </label>
                  <select
                    value={action.type}
                    onChange={(e) => updateCapaAction(action.id, 'type', e.target.value)}
                    className="form-input"
                    required
                  >
                    <option value="corrective">Corrective Action</option>
                    <option value="preventive">Preventive Action</option>
                    <option value="both">Both Corrective & Preventive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={action.status}
                    onChange={(e) => updateCapaAction(action.id, 'status', e.target.value)}
                    className="form-input"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="verified">Verified</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Description *
                </label>
                <textarea
                  value={action.description}
                  onChange={(e) => updateCapaAction(action.id, 'description', e.target.value)}
                  className="form-textarea"
                  rows="3"
                  placeholder="Describe the specific action to be taken..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Action Owner *
                  </label>
                  <input
                    type="text"
                    value={action.owner}
                    onChange={(e) => updateCapaAction(action.id, 'owner', e.target.value)}
                    className="form-input"
                    placeholder="Name and Title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    value={action.dueDate}
                    onChange={(e) => updateCapaAction(action.id, 'dueDate', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Effectiveness Metric *
                </label>
                <textarea
                  value={action.effectivenessMetric}
                  onChange={(e) => updateCapaAction(action.id, 'effectivenessMetric', e.target.value)}
                  className="form-textarea"
                  rows="2"
                  placeholder="How will the effectiveness of this action be measured?"
                  required
                />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CAPA Effectiveness Review Plan *
        </label>
        <textarea
          value={data.effectivenessReviewPlan || ''}
          onChange={(e) => handleChange('effectivenessReviewPlan', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Describe the plan for reviewing CAPA effectiveness..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CAPA Review Date *
          </label>
          <input
            type="date"
            value={data.reviewDate || ''}
            onChange={(e) => handleChange('reviewDate', e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CAPA Reviewer *
          </label>
          <input
            type="text"
            value={data.reviewer || ''}
            onChange={(e) => handleChange('reviewer', e.target.value)}
            className="form-input"
            placeholder="Name and Title"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Implementation Timeline
        </label>
        <textarea
          value={data.implementationTimeline || ''}
          onChange={(e) => handleChange('implementationTimeline', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Describe the overall timeline for implementing all CAPA actions..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resource Requirements
        </label>
        <textarea
          value={data.resourceRequirements || ''}
          onChange={(e) => handleChange('resourceRequirements', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Personnel, budget, equipment, training needs..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Risk Assessment of CAPA Actions
        </label>
        <textarea
          value={data.riskAssessment || ''}
          onChange={(e) => handleChange('riskAssessment', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Assess any risks associated with implementing these CAPA actions..."
        />
      </div>

      {/* CAPA Summary */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-semibold text-green-900 mb-2">
          CAPA Summary
        </h4>
        <div className="text-sm text-green-800 space-y-1">
          <p>Total Actions: {actions.length}</p>
          <p>Corrective Actions: {actions.filter(a => a.type === 'corrective' || a.type === 'both').length}</p>
          <p>Preventive Actions: {actions.filter(a => a.type === 'preventive' || a.type === 'both').length}</p>
          <p>Completed Actions: {actions.filter(a => a.status === 'completed' || a.status === 'verified').length}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default CapaStep;