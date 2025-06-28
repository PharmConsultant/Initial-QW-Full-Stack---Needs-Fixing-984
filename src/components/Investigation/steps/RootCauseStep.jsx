import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';
import { FiCheckCircle, FiAlertTriangle, FiPlus } from 'react-icons/fi';

function RootCauseStep() {
  const { formData, updateFormData } = useDeviation();
  const data = formData.rootCause || {};
  const [selectedMethods, setSelectedMethods] = useState(data.methods || []);

  // Available RCA methods - configurable in system settings
  const availableMethods = [
    {
      id: '5-whys',
      name: '5 Whys Method',
      description: 'Sequential questioning to drill down to root cause through iterative "why" questions.'
    },
    {
      id: 'fishbone',
      name: 'Fishbone (Ishikawa)',
      description: 'Categorical analysis examining Man, Machine, Material, Method, Environment, and Measurement.'
    },
    {
      id: 'fault-tree',
      name: 'Fault Tree Analysis',
      description: 'Top-down approach using Boolean logic to analyze potential causes.'
    },
    {
      id: 'barrier-analysis',
      name: 'Barrier Analysis',
      description: 'Examines barriers that failed to prevent the incident.'
    }
  ];

  const handleChange = (field, value) => {
    updateFormData('rootCause', { [field]: value });
  };

  const handleMethodToggle = (methodId) => {
    const newMethods = selectedMethods.includes(methodId)
      ? selectedMethods.filter(m => m !== methodId)
      : [...selectedMethods, methodId];
    
    setSelectedMethods(newMethods);
    handleChange('methods', newMethods);
  };

  // Gateway G4 Check
  const isMethodSelected = selectedMethods.length > 0 && data.methodJustification;

  const renderFiveWhys = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900">5 Whys Analysis</h4>
      {[1, 2, 3, 4, 5].map((num) => (
        <div key={num}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why {num}? {num === 1 && '*'}
          </label>
          <textarea
            value={data[`why${num}`] || ''}
            onChange={(e) => handleChange(`why${num}`, e.target.value)}
            className="form-textarea"
            rows="2"
            placeholder={`Why did this happen? (Level ${num})`}
            required={num === 1}
          />
        </div>
      ))}
    </div>
  );

  const renderFishbone = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900">Fishbone (Ishikawa) Analysis</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Man/People Factors
          </label>
          <textarea
            value={data.fishboneMan || ''}
            onChange={(e) => handleChange('fishboneMan', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Training, competency, human error factors..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Machine/Equipment Factors
          </label>
          <textarea
            value={data.fishboneMachine || ''}
            onChange={(e) => handleChange('fishboneMachine', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Equipment malfunction, maintenance issues..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material Factors
          </label>
          <textarea
            value={data.fishboneMaterial || ''}
            onChange={(e) => handleChange('fishboneMaterial', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Raw materials, components, specifications..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Method/Process Factors
          </label>
          <textarea
            value={data.fishboneMethod || ''}
            onChange={(e) => handleChange('fishboneMethod', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="SOPs, procedures, process parameters..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environment Factors
          </label>
          <textarea
            value={data.fishboneEnvironment || ''}
            onChange={(e) => handleChange('fishboneEnvironment', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Temperature, humidity, cleanliness..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Measurement Factors
          </label>
          <textarea
            value={data.fishboneMeasurement || ''}
            onChange={(e) => handleChange('fishboneMeasurement', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Calibration, testing methods, data collection..."
          />
        </div>
      </div>
    </div>
  );

  const renderFaultTree = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900">Fault Tree Analysis</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Top Event (Undesired Outcome)
        </label>
        <input
          type="text"
          value={data.faultTreeTopEvent || ''}
          onChange={(e) => handleChange('faultTreeTopEvent', e.target.value)}
          className="form-input"
          placeholder="Define the top-level failure event"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Immediate Causes
        </label>
        <textarea
          value={data.faultTreeImmediate || ''}
          onChange={(e) => handleChange('faultTreeImmediate', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="List immediate causes that led to the top event"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Basic Events/Root Causes
        </label>
        <textarea
          value={data.faultTreeBasic || ''}
          onChange={(e) => handleChange('faultTreeBasic', e.target.value)}
          className="form-textarea"
          rows="4"
          placeholder="Identify basic events and root causes"
        />
      </div>
    </div>
  );

  const renderBarrierAnalysis = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900">Barrier Analysis</h4>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Planned Barriers
        </label>
        <textarea
          value={data.barrierPlanned || ''}
          onChange={(e) => handleChange('barrierPlanned', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="What barriers were planned to prevent this event?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Failed Barriers
        </label>
        <textarea
          value={data.barrierFailed || ''}
          onChange={(e) => handleChange('barrierFailed', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Which barriers failed and why?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Missing Barriers
        </label>
        <textarea
          value={data.barrierMissing || ''}
          onChange={(e) => handleChange('barrierMissing', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="What barriers were missing that could have prevented this?"
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Root Cause Analysis Methods * (Select one or more)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => handleMethodToggle(method.id)}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedMethods.includes(method.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{method.name}</h4>
                  {selectedMethods.includes(method.id) && (
                    <FiCheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{method.description}</p>
              </button>
            ))}
          </div>
        </div>

        {selectedMethods.length > 0 && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Method Selection Justification *
            </label>
            <textarea
              value={data.methodJustification || ''}
              onChange={(e) => handleChange('methodJustification', e.target.value)}
              className="form-textarea"
              rows="3"
              placeholder="Explain why these RCA methods are appropriate for this deviation..."
              required
            />
          </div>
        )}

        {/* Gateway G4 Check */}
        <div className={`mt-6 p-4 rounded-lg border ${
          isMethodSelected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {isMethodSelected ? (
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <FiAlertTriangle className="w-5 h-5 text-red-600" />
            )}
            <h4 className={`text-sm font-semibold ${
              isMethodSelected ? 'text-green-900' : 'text-red-900'
            }`}>
              Gateway G4: RCA Method Selection Check
            </h4>
          </div>
          <div className={`text-sm ${
            isMethodSelected ? 'text-green-800' : 'text-red-800'
          }`}>
            {isMethodSelected ? (
              <p>✓ RCA methods selected and justified.</p>
            ) : (
              <p>⚠ Select RCA methods and provide justification before proceeding.</p>
            )}
          </div>
        </div>

        {/* Render selected methods */}
        <div className="mt-6 space-y-8">
          {selectedMethods.includes('5-whys') && renderFiveWhys()}
          {selectedMethods.includes('fishbone') && renderFishbone()}
          {selectedMethods.includes('fault-tree') && renderFaultTree()}
          {selectedMethods.includes('barrier-analysis') && renderBarrierAnalysis()}
        </div>

        {selectedMethods.length > 0 && (
          <>
            <div className="mt-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Root Cause Conclusion *
              </label>
              <textarea
                value={data.rootCauseConclusion || ''}
                onChange={(e) => handleChange('rootCauseConclusion', e.target.value)}
                className="form-textarea"
                rows="4"
                placeholder="Based on the analysis above, what is the determined root cause?"
                required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contributing Factors
              </label>
              <textarea
                value={data.contributingFactors || ''}
                onChange={(e) => handleChange('contributingFactors', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="List any additional contributing factors identified..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Supporting Root Cause
              </label>
              <textarea
                value={data.supportingEvidence || ''}
                onChange={(e) => handleChange('supportingEvidence', e.target.value)}
                className="form-textarea"
                rows="3"
                placeholder="Provide evidence that supports the identified root cause..."
              />
            </div>

            {/* AI Red Flag Detection */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
                <h4 className="text-sm font-semibold text-yellow-900">
                  AI Red Flag Detection
                </h4>
              </div>
              <div className="text-sm text-yellow-800">
                <p>⚠ Avoid generic conclusions like "human error" without specific analysis.</p>
                <p>✓ Ensure root cause addresses systemic issues, not just individual blame.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default RootCauseStep;