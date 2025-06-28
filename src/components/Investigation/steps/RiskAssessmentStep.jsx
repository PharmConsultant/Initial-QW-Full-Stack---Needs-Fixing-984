import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';
import { FiAlertTriangle, FiHelpCircle } from 'react-icons/fi';

function RiskAssessmentStep() {
  const { formData, updateFormData } = useDeviation();
  const data = formData.riskAssessment || {};
  const [showClassificationQuestions, setShowClassificationQuestions] = useState(false);
  const [systemClassification, setSystemClassification] = useState('');

  const handleChange = (field, value) => {
    updateFormData('riskAssessment', { [field]: value });
  };

  const calculateRPN = () => {
    const severity = parseInt(data.severity) || 0;
    const occurrence = parseInt(data.occurrence) || 0;
    const detection = parseInt(data.detection) || 0;
    return severity * occurrence * detection;
  };

  const getRPNRisk = (rpn) => {
    if (rpn >= 80) return { level: 'High', color: 'text-red-600' };
    if (rpn >= 40) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-green-600' };
  };

  const handleRPNCalculation = () => {
    const rpn = calculateRPN();
    if (rpn > 0 && !systemClassification) {
      setShowClassificationQuestions(true);
    }
  };

  // Classification questions - will be configurable in system settings
  const classificationQuestions = [
    {
      id: 'patient_safety',
      question: 'Does this deviation have the potential to adversely affect patient safety?',
      type: 'boolean',
      weight: 'critical'
    },
    {
      id: 'product_quality',
      question: 'Does this deviation affect product quality attributes?',
      type: 'boolean',
      weight: 'major'
    },
    {
      id: 'regulatory_impact',
      question: 'Is this deviation reportable to regulatory agencies?',
      type: 'boolean',
      weight: 'major'
    },
    {
      id: 'batch_impact',
      question: 'How many batches are potentially affected?',
      type: 'select',
      options: ['1 batch', '2-5 batches', 'More than 5 batches'],
      weight: 'variable'
    }
  ];

  const [questionAnswers, setQuestionAnswers] = useState({});

  const handleQuestionAnswer = (questionId, answer) => {
    setQuestionAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const determineClassification = () => {
    // This logic will be configurable in system settings
    const { patient_safety, regulatory_impact, batch_impact } = questionAnswers;
    
    if (patient_safety === 'yes' || regulatory_impact === 'yes') {
      return 'Critical';
    } else if (batch_impact === 'More than 5 batches') {
      return 'Major';
    } else if (questionAnswers.product_quality === 'yes') {
      return 'Major';
    } else {
      return 'Minor';
    }
  };

  const handleClassificationSubmit = () => {
    const classification = determineClassification();
    setSystemClassification(classification);
    handleChange('systemClassification', classification);
    setShowClassificationQuestions(false);
  };

  const rpn = calculateRPN();
  const riskLevel = getRPNRisk(rpn);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">Risk Assessment</h4>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Initial Classification *
          </label>
          <select
            value={data.classification || ''}
            onChange={(e) => handleChange('classification', e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Classification</option>
            <option value="minor">Minor</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Severity (1-10) *
            </label>
            <select
              value={data.severity || ''}
              onChange={(e) => handleChange('severity', e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              1=No effect, 10=Hazardous without warning
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occurrence (1-10) *
            </label>
            <select
              value={data.occurrence || ''}
              onChange={(e) => handleChange('occurrence', e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              1=Remote, 10=Very high
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detection (1-10) *
            </label>
            <select
              value={data.detection || ''}
              onChange={(e) => handleChange('detection', e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select</option>
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              1=Almost certain, 10=Absolute uncertainty
            </p>
          </div>
        </div>

        {/* RPN Calculation */}
        <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Risk Priority Number (RPN) Calculation
            </h4>
            <button
              onClick={handleRPNCalculation}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
            >
              <FiHelpCircle className="w-4 h-4" />
              <span className="text-sm">Determine Classification</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-gray-600">
              Severity × Occurrence × Detection =
            </span>
            <span className="text-3xl font-bold text-gray-900">
              {rpn}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
              riskLevel.level === 'High' ? 'bg-red-100 text-red-800' :
              riskLevel.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {riskLevel.level} Risk
            </span>
          </div>

          {systemClassification && (
            <div className="mt-4 p-4 bg-blue-100 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <FiAlertTriangle className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  System Determined Classification: <strong>{systemClassification}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Safety Impact Assessment *
            </label>
            <select
              value={data.patientSafetyImpact || ''}
              onChange={(e) => handleChange('patientSafetyImpact', e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Impact Level</option>
              <option value="none">No Impact</option>
              <option value="potential">Potential Impact</option>
              <option value="confirmed">Confirmed Impact</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Quality Impact Assessment *
            </label>
            <select
              value={data.productQualityImpact || ''}
              onChange={(e) => handleChange('productQualityImpact', e.target.value)}
              className="form-input"
              required
            >
              <option value="">Select Impact Level</option>
              <option value="none">No Impact</option>
              <option value="potential">Potential Impact</option>
              <option value="confirmed">Confirmed Impact</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Regulatory Impact Assessment
          </label>
          <textarea
            value={data.regulatoryImpact || ''}
            onChange={(e) => handleChange('regulatoryImpact', e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Assess potential regulatory implications (FDA, EMA, MHRA, etc.)..."
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Risk Assessment Justification *
          </label>
          <textarea
            value={data.riskJustification || ''}
            onChange={(e) => handleChange('riskJustification', e.target.value)}
            className="form-textarea"
            rows="4"
            placeholder="Provide detailed justification for the risk assessment ratings..."
            required
          />
        </div>
      </div>

      {/* Classification Questions Modal */}
      {showClassificationQuestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl m-4 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Classification Assessment
              </h3>
              <p className="text-gray-600 mb-6">
                Answer the following questions to determine the system classification:
              </p>

              <div className="space-y-6">
                {classificationQuestions.map((question) => (
                  <div key={question.id} className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      {question.question}
                    </label>
                    
                    {question.type === 'boolean' ? (
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={question.id}
                            value="yes"
                            checked={questionAnswers[question.id] === 'yes'}
                            onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                            className="mr-2"
                          />
                          Yes
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={question.id}
                            value="no"
                            checked={questionAnswers[question.id] === 'no'}
                            onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                            className="mr-2"
                          />
                          No
                        </label>
                      </div>
                    ) : (
                      <select
                        value={questionAnswers[question.id] || ''}
                        onChange={(e) => handleQuestionAnswer(question.id, e.target.value)}
                        className="form-input"
                      >
                        <option value="">Select...</option>
                        {question.options.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={() => setShowClassificationQuestions(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClassificationSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Determine Classification
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default RiskAssessmentStep;