import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiCheckCircle, FiTrendingUp, FiExternalLink } from 'react-icons/fi';

function QualityScoring({ investigationData }) {
  const [qualityAnalysis, setQualityAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateQualityScore = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = {
        overallScore: 87,
        breakdown: {
          documentation: 92,
          timeline: 85,
          investigation: 88,
          capa: 84,
          regulatory: 89
        },
        riskAssessment: 'Medium-Low',
        fdaCompliance: {
          section483Risks: [
            'Investigation depth could be enhanced for root cause analysis',
            'CAPA effectiveness metrics need clearer definition'
          ],
          warningLetterRisks: [
            'Timeline compliance is within acceptable range',
            'Documentation quality meets standards'
          ]
        },
        improvements: [
          'Implement more structured root cause analysis methodology',
          'Enhance CAPA effectiveness tracking',
          'Add trending analysis for similar deviations',
          'Include risk-based approach documentation'
        ],
        regulatoryAlignment: {
          cfr210211: 'Compliant',
          alcoa: 'Mostly Compliant',
          ichE6: 'Compliant'
        }
      };
      
      setQualityAnalysis(analysis);
    } catch (error) {
      console.error('Error generating quality score:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 80) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Generate Quality Score Button */}
      <div className="text-center">
        <button
          onClick={generateQualityScore}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors mx-auto"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Analyzing Quality...</span>
            </>
          ) : (
            <>
              <FiShield className="w-5 h-5" />
              <span>Generate Quality Score</span>
            </>
          )}
        </button>
      </div>

      {/* Quality Analysis Results */}
      {qualityAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Overall Score */}
          <div className={`p-6 rounded-lg border-2 ${getScoreBackground(qualityAnalysis.overallScore)}`}>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Quality Score</h3>
              <div className={`text-6xl font-bold ${getScoreColor(qualityAnalysis.overallScore)} mb-4`}>
                {qualityAnalysis.overallScore}%
              </div>
              <p className="text-gray-600">
                Risk Assessment: <span className="font-semibold">{qualityAnalysis.riskAssessment}</span>
              </p>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Score Breakdown</h4>
            <div className="space-y-4">
              {Object.entries(qualityAnalysis.breakdown).map(([category, score]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          score >= 90 ? 'bg-green-500' : 
                          score >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FDA Compliance Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiAlertTriangle className="w-5 h-5 text-red-600" />
                <h4 className="text-lg font-semibold text-gray-900">FDA 483 Risk Factors</h4>
                <a
                  href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/inspection-guides/inspection-database"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-3">
                {qualityAnalysis.fdaCompliance.section483Risks.map((risk, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{risk}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900">Warning Letter Prevention</h4>
                <a
                  href="https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/compliance-actions-and-activities/warning-letters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-3">
                {qualityAnalysis.fdaCompliance.warningLetterRisks.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regulatory Alignment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Regulatory Alignment</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(qualityAnalysis.regulatoryAlignment).map(([regulation, status]) => (
                <div key={regulation} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 uppercase">
                    {regulation.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'Compliant' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Recommendations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <FiTrendingUp className="w-5 h-5 text-blue-600" />
              <h4 className="text-lg font-semibold text-gray-900">Improvement Recommendations</h4>
            </div>
            <div className="space-y-3">
              {qualityAnalysis.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-blue-800">{improvement}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default QualityScoring;