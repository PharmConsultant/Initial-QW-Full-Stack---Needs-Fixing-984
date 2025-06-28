import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';
import { FiZap, FiCheckCircle, FiAlertTriangle, FiPlus, FiTrash2 } from 'react-icons/fi';

function BasicInfoStepProfessional() {
  const { formData, updateFormData } = useDeviation();
  const data = formData.basicInfo || {};
  const [isGeneratingProblemStatement, setIsGeneratingProblemStatement] = useState(false);
  const [generatedProblemStatement, setGeneratedProblemStatement] = useState('');
  
  // Timeline validation
  const [timelineJustification, setTimelineJustification] = useState('');
  const [showTimelineJustification, setShowTimelineJustification] = useState(false);
  
  // Personnel notifications - start with 3 boxes, allow add/subtract
  const [personnelNotified, setPersonnelNotified] = useState(
    data.personnelNotified || [
      { name: '', title: '', shift: '' },
      { name: '', title: '', shift: '' },
      { name: '', title: '', shift: '' }
    ]
  );

  // System configuration
  const [systemConfig] = useState({
    timelineSettings: {
      occurrenceToDiscovery: 3,
      discoveryToOpening: 3,
      requireJustification: true
    },
    manufacturingAreas: [
      'Production Line 1',
      'Production Line 2', 
      'Packaging Area A',
      'Packaging Area B',
      'Quality Control Lab',
      'Quality Assurance',
      'Warehouse - Ambient',
      'Warehouse - Cold Storage',
      'Maintenance Shop',
      'Utilities'
    ]
  });

  const handleChange = (field, value) => {
    updateFormData('basicInfo', { [field]: value });
    
    if (field === 'whenOccurred' || field === 'whenDiscovered') {
      checkTimelineCompliance();
    }
  };

  const checkTimelineCompliance = () => {
    if (data.whenOccurred && data.whenDiscovered && data.dateOpened) {
      const occurrence = new Date(data.whenOccurred);
      const discovery = new Date(data.whenDiscovered);
      const timeDiff = Math.abs(discovery - occurrence) / (1000 * 60 * 60 * 24);
      
      if (timeDiff > systemConfig.timelineSettings.occurrenceToDiscovery) {
        setShowTimelineJustification(true);
      } else {
        setShowTimelineJustification(false);
        setTimelineJustification('');
      }
    }
  };

  const checkGatewayCriteria = () => {
    if (data.whenOccurred && data.whenDiscovered && data.dateOpened) {
      const occurrence = new Date(data.whenOccurred);
      const discovery = new Date(data.whenDiscovered);
      const opened = new Date(data.dateOpened);
      
      const occurrenceToDiscovery = Math.abs(discovery - occurrence) / (1000 * 60 * 60 * 24);
      const discoveryToOpened = Math.abs(opened - discovery) / (1000 * 60 * 60 * 24);
      
      const meetsCriteria = occurrenceToDiscovery <= systemConfig.timelineSettings.occurrenceToDiscovery &&
                           discoveryToOpened <= systemConfig.timelineSettings.discoveryToOpening;
      
      return { meetsCriteria, occurrenceToDiscovery, discoveryToOpened };
    }
    return { meetsCriteria: null, occurrenceToDiscovery: 0, discoveryToOpened: 0 };
  };

  const addPersonnelRow = () => {
    if (personnelNotified.length < 10) {
      setPersonnelNotified([...personnelNotified, { name: '', title: '', shift: '' }]);
    }
  };

  const removePersonnelRow = (index) => {
    if (personnelNotified.length > 1) {
      const newPersonnel = personnelNotified.filter((_, i) => i !== index);
      setPersonnelNotified(newPersonnel);
      handleChange('personnelNotified', newPersonnel);
    }
  };

  const updatePersonnelRow = (index, field, value) => {
    const newPersonnel = personnelNotified.map((person, i) => 
      i === index ? { ...person, [field]: value } : person
    );
    setPersonnelNotified(newPersonnel);
    handleChange('personnelNotified', newPersonnel);
  };

  useEffect(() => {
    checkTimelineCompliance();
  }, [data.whenOccurred, data.whenDiscovered, data.dateOpened]);

  const checkRequiredFields = () => {
    const requiredFields = [
      'whoDiscovered', 'whatHappened', 'whenOccurred', 'whenDiscovered', 'dateOpened',
      'howOccurred', 'documentName', 'documentNumber', 'effectiveDate', 'pageNumber', 
      'stepNumber', 'expectedResult'
    ];
    const timelineValid = !showTimelineJustification || timelineJustification.trim();
    
    return requiredFields.every(field => data[field] && data[field].trim()) && timelineValid;
  };

  const generateProblemStatement = async () => {
    if (!checkRequiredFields()) {
      alert('Please complete all required fields and timeline justification before generating the problem statement.');
      return;
    }

    setIsGeneratingProblemStatement(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const problemStatement = `
On ${data.whenOccurred}, a deviation was discovered on ${data.whenDiscovered} and opened on ${data.dateOpened} by ${data.whoDiscovered} where ${data.whatHappened}.

${showTimelineJustification ? `Timeline Justification: ${timelineJustification}` : ''}

Mechanism of Occurrence: ${data.howOccurred}

Document Information:
- Document Name: ${data.documentName}
- Document Number & Revision: ${data.documentNumber}
- Effective Date: ${data.effectiveDate}
- Page: ${data.pageNumber}, Step: ${data.stepNumber}
- Expected Result: ${data.expectedResult}

Personnel Notified:
${personnelNotified.filter(p => p.name).map(p => `- ${p.name}, ${p.title}, ${p.shift} Shift`).join('\n')}

QA Representative ${data.qaRepNotified || '[Name]'} was notified on ${data.whenQaNotified || '[Date]'} at ${data.timeQaNotified || '[Time]'}.

Immediate Actions:
${data.immediateActions || 'Actions to be documented'}

Quarantine Status:
- Logbook: ${data.quarantinedLogbook ? 'Yes' : 'No'}
- SAP: ${data.quarantinedSAP ? 'Yes' : 'No'}
      `.trim();

      setGeneratedProblemStatement(problemStatement);
      handleChange('generatedProblemStatement', problemStatement);
      
    } catch (error) {
      console.error('Error generating problem statement:', error);
      alert('Error generating problem statement. Please try again.');
    } finally {
      setIsGeneratingProblemStatement(false);
    }
  };

  const requiredFieldsComplete = checkRequiredFields();
  const gatewayCriteria = checkGatewayCriteria();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-2">
          Deviation Initial Report
        </h3>
        <p className="text-blue-800">
          Complete all required fields to capture the initial deviation details. The system will analyze your inputs to generate a comprehensive problem statement.
        </p>
      </div>

      {/* Administrative Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Administrative Information</h4>
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
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={data.productName || ''}
              onChange={(e) => handleChange('productName', e.target.value)}
              className="form-input"
              placeholder="Aspirin 325mg Tablets"
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
              {systemConfig.manufacturingAreas.map((area, index) => (
                <option key={index} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timeline Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Timeline Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When did it occur? *
            </label>
            <input
              type="datetime-local"
              value={data.whenOccurred || ''}
              onChange={(e) => handleChange('whenOccurred', e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When was it discovered? *
            </label>
            <input
              type="datetime-local"
              value={data.whenDiscovered || ''}
              onChange={(e) => handleChange('whenDiscovered', e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Opened *
            </label>
            <input
              type="datetime-local"
              value={data.dateOpened || ''}
              onChange={(e) => handleChange('dateOpened', e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        {/* Gateway Criteria Check */}
        {gatewayCriteria.meetsCriteria !== null && (
          <div className="mt-6">
            <div className={`p-6 rounded-xl border-2 ${
              gatewayCriteria.meetsCriteria ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                {gatewayCriteria.meetsCriteria ? (
                  <FiCheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <FiAlertTriangle className="w-8 h-8 text-red-600" />
                )}
                <h5 className={`text-xl font-bold ${
                  gatewayCriteria.meetsCriteria ? 'text-green-900' : 'text-red-900'
                }`}>
                  {gatewayCriteria.meetsCriteria ? 'MEETS CRITERIA' : 'DOESN\'T MEET CRITERIA'}
                </h5>
              </div>
              <div className={`text-sm ${
                gatewayCriteria.meetsCriteria ? 'text-green-800' : 'text-red-800'
              }`}>
                <p>Occurrence → Discovery: {gatewayCriteria.occurrenceToDiscovery.toFixed(1)} days (Limit: {systemConfig.timelineSettings.occurrenceToDiscovery})</p>
                <p>Discovery → Opened: {gatewayCriteria.discoveryToOpened.toFixed(1)} days (Limit: {systemConfig.timelineSettings.discoveryToOpening})</p>
              </div>
            </div>
          </div>
        )}

        {/* Timeline Justification */}
        {showTimelineJustification && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeline Justification * (Required for Gateway Compliance)
            </label>
            <textarea
              value={timelineJustification}
              onChange={(e) => setTimelineJustification(e.target.value)}
              className="form-textarea"
              rows="3"
              placeholder="Explain why the timeline exceeded the limit..."
              required
            />
          </div>
        )}
      </div>

      {/* What was the deviation */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">
          What was the deviation? <span className="text-red-500">*Required Fields</span>
        </h4>
        
        <div className="space-y-6">
          {/* Who and What on same line */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Who discovered the issue? *
              </label>
              <input
                type="text"
                value={data.whoDiscovered || ''}
                onChange={(e) => handleChange('whoDiscovered', e.target.value)}
                className="form-input"
                placeholder="Name, title, department"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What Happened? *
              </label>
              <input
                type="text"
                value={data.whatHappened || ''}
                onChange={(e) => handleChange('whatHappened', e.target.value)}
                className="form-input"
                placeholder="Describe specifically what occurred"
                required
              />
            </div>
          </div>

          {/* When and How on same line */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Where did it occur? *
              </label>
              <input
                type="text"
                value={data.whereOccurred || ''}
                onChange={(e) => handleChange('whereOccurred', e.target.value)}
                className="form-input"
                placeholder="Specific location, equipment, room, line"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How did it occur? *
              </label>
              <input
                type="text"
                value={data.howOccurred || ''}
                onChange={(e) => handleChange('howOccurred', e.target.value)}
                className="form-input"
                placeholder="Mechanism or sequence of events"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Document Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Document Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Name *
            </label>
            <input
              type="text"
              value={data.documentName || ''}
              onChange={(e) => handleChange('documentName', e.target.value)}
              className="form-input"
              placeholder="Standard Operating Procedure"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Number & Revision *
            </label>
            <input
              type="text"
              value={data.documentNumber || ''}
              onChange={(e) => handleChange('documentNumber', e.target.value)}
              className="form-input"
              placeholder="SOP-001 Rev. 3"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Effective Date *
            </label>
            <input
              type="date"
              value={data.effectiveDate || ''}
              onChange={(e) => handleChange('effectiveDate', e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Page # *
              </label>
              <input
                type="text"
                value={data.pageNumber || ''}
                onChange={(e) => handleChange('pageNumber', e.target.value)}
                className="form-input"
                placeholder="Page"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step # *
              </label>
              <input
                type="text"
                value={data.stepNumber || ''}
                onChange={(e) => handleChange('stepNumber', e.target.value)}
                className="form-input"
                placeholder="Step"
                required
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specification/Expected Result *
            </label>
            <textarea
              value={data.expectedResult || ''}
              onChange={(e) => handleChange('expectedResult', e.target.value)}
              className="form-textarea"
              rows="3"
              placeholder="Describe what should have happened according to the procedure"
              required
            />
          </div>
        </div>
      </div>

      {/* Supplemental Information */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Supplemental Information</h4>
        
        <div className="space-y-6">
          {/* Personnel Notified */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Personnel Notified, Title, & Shift
              </label>
              <button
                type="button"
                onClick={addPersonnelRow}
                disabled={personnelNotified.length >= 10}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {personnelNotified.map((person, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePersonnelRow(index, 'name', e.target.value)}
                    className="form-input"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={person.title}
                    onChange={(e) => updatePersonnelRow(index, 'title', e.target.value)}
                    className="form-input"
                    placeholder="Title"
                  />
                  <select
                    value={person.shift}
                    onChange={(e) => updatePersonnelRow(index, 'shift', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Shift</option>
                    <option value="Day">Day</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                    <option value="Weekend">Weekend</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removePersonnelRow(index)}
                    disabled={personnelNotified.length <= 1}
                    className="flex items-center justify-center px-3 py-2 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* QA Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Which QA Representative Notified
              </label>
              <input
                type="text"
                value={data.qaRepNotified || ''}
                onChange={(e) => handleChange('qaRepNotified', e.target.value)}
                className="form-input"
                placeholder="QA Representative name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When:
              </label>
              <input
                type="date"
                value={data.whenQaNotified || ''}
                onChange={(e) => handleChange('whenQaNotified', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time:
              </label>
              <input
                type="time"
                value={data.timeQaNotified || ''}
                onChange={(e) => handleChange('timeQaNotified', e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Immediate Actions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Immediate Actions:
            </label>
            <textarea
              value={data.immediateActions || ''}
              onChange={(e) => handleChange('immediateActions', e.target.value)}
              className="form-textarea"
              rows="4"
              placeholder="Describe all immediate actions taken to contain the deviation"
            />
          </div>

          {/* Quarantine Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Quarantine Status:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.quarantinedLogbook || false}
                  onChange={(e) => handleChange('quarantinedLogbook', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Quarantined in Logbook</span>
              </label>
              <label className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.quarantinedSAP || false}
                  onChange={(e) => handleChange('quarantinedSAP', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Quarantined in SAP</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* AI Problem Statement Generation */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
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
                  AI Analysis Complete - Problem Statement Generated
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
                rows="15"
                placeholder="AI-generated problem statement will appear here..."
              />
              <p className="text-xs text-gray-500 mt-2">
                You can edit the generated problem statement as needed. This will be used in subsequent investigation steps.
              </p>
            </div>
          </div>
        )}

        {!generatedProblemStatement && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Complete the required fields above and click "Generate Problem Statement" to create a comprehensive problem statement using AI analysis.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default BasicInfoStepProfessional;