import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiDownload, FiSettings } from 'react-icons/fi';
import { useDeviation } from '../../context/DeviationContext';
import ReportPreview from './ReportPreview';
import AIModelSelector from './AIModelSelector';
import QualityScoring from '../Quality/QualityScoring';

function ReportGeneratorEnhanced() {
  const { deviations } = useDeviation();
  const [selectedDeviation, setSelectedDeviation] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showQualityScoring, setShowQualityScoring] = useState(false);

  const handleGenerateReport = async () => {
    if (!selectedDeviation) return;

    setIsGenerating(true);
    try {
      // Simulate AI report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const deviation = deviations.find(d => d.id === selectedDeviation);
      const mockReport = {
        id: `RPT-${Date.now()}`,
        deviationId: deviation?.id || selectedDeviation,
        title: `Deviation Investigation Report - ${selectedDeviation}`,
        generatedAt: new Date().toISOString(),
        model: selectedModel,
        content: generateMockReportContent(deviation),
        format: reportFormat
      };

      setGeneratedReport(mockReport);
      setShowQualityScoring(true);
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockReportContent = (deviation) => {
    return {
      executiveSummary: `This report documents the investigation of deviation ${deviation?.id || selectedDeviation} in accordance with FDA 21 CFR 210/211 requirements. The investigation was conducted following ALCOA++ principles and included comprehensive root cause analysis, risk assessment, and CAPA development.`,
      deviationDetails: {
        id: deviation?.id || selectedDeviation,
        classification: 'Major',
        dateOccurred: '2024-01-15',
        dateDiscovered: '2024-01-15',
        description: 'Temperature excursion detected in cold storage area during routine monitoring.',
        area: 'Warehouse - Cold Storage Room 2'
      },
      investigation: {
        methodology: '5 Whys Root Cause Analysis',
        findings: 'HVAC system malfunction due to scheduled maintenance overrun',
        rootCause: 'Inadequate maintenance scheduling coordination between facilities and production teams',
        evidence: 'Temperature logs, HVAC maintenance records, personnel interviews'
      },
      riskAssessment: {
        classification: 'Major',
        rpn: 72,
        patientSafety: 'Potential impact - products may have been exposed to out-of-specification temperatures',
        productQuality: 'Confirmed impact - 3 batches quarantined for stability testing'
      },
      containment: [
        'Immediate quarantine of affected products',
        'Alternative storage arrangements implemented',
        'HVAC system emergency repair completed',
        'Enhanced monitoring protocols activated'
      ],
      capa: [
        {
          type: 'Corrective',
          description: 'Implement automated maintenance scheduling system',
          owner: 'Facilities Manager',
          dueDate: '2024-02-28',
          effectiveness: 'Zero maintenance-related deviations for 6 months'
        },
        {
          type: 'Preventive',
          description: 'Install redundant temperature monitoring with SMS alerts',
          owner: 'QA Manager',
          dueDate: '2024-03-15',
          effectiveness: 'Real-time detection of temperature excursions'
        }
      ],
      trending: {
        category: 'Equipment/System Failures',
        frequency: 'Third occurrence in 12 months',
        systemWideImpact: 'Review all critical utility systems for similar risks'
      },
      conclusion: 'This investigation demonstrates compliance with regulatory requirements and establishes robust preventive measures to prevent recurrence. All actions are tracked for effectiveness verification.',
      approvals: [
        { role: 'QA Investigator', name: 'Sarah Johnson', date: '2024-01-20' },
        { role: 'QA Manager', name: 'Michael Chen', date: '2024-01-22' },
        { role: 'Site Head', name: 'Jennifer Smith', date: '2024-01-23' }
      ]
    };
  };

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiFileText className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">AI Report Generator</h1>
        </div>
        <p className="text-gray-600">
          Generate comprehensive, FDA 21 CFR 210/211 compliant deviation investigation reports with quality scoring
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <FiSettings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Deviation *
              </label>
              <select
                value={selectedDeviation}
                onChange={(e) => setSelectedDeviation(e.target.value)}
                className="form-input"
                required
              >
                <option value="">Choose deviation to report...</option>
                {deviations.map((deviation) => (
                  <option key={deviation.id} value={deviation.id}>
                    {deviation.id} - {deviation.basicInfo?.description || 'Draft Investigation'}
                  </option>
                ))}
                {/* Mock options for demonstration */}
                <option value="DEV-2024-001">DEV-2024-001 - Temperature Excursion</option>
                <option value="DEV-2024-002">DEV-2024-002 - Documentation Error</option>
                <option value="DEV-2024-003">DEV-2024-003 - Equipment Malfunction</option>
              </select>
            </div>

            <AIModelSelector
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Format
              </label>
              <div className="space-y-2">
                {[
                  { value: 'pdf', label: 'PDF Document', desc: 'Professional report with formatting' },
                  { value: 'docx', label: 'Word Document', desc: 'Editable format for customization' },
                  { value: 'txt', label: 'Plain Text', desc: 'Simple text format' }
                ].map((format) => (
                  <label
                    key={format.value}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.value}
                      checked={reportFormat === format.value}
                      onChange={(e) => setReportFormat(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{format.label}</p>
                      <p className="text-xs text-gray-500">{format.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerateReport}
              disabled={!selectedDeviation || isGenerating}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating Report...</span>
                </>
              ) : (
                <>
                  <FiFileText className="w-5 h-5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>

            {generatedReport && (
              <button
                onClick={() => {
                  // Simulate download
                  const blob = new Blob([JSON.stringify(generatedReport, null, 2)], {
                    type: 'application/json'
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${generatedReport.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiDownload className="w-5 h-5" />
                <span>Download Report</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Report Preview and Quality Scoring */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {showQualityScoring && generatedReport ? (
            <div className="space-y-6">
              <QualityScoring investigationData={generatedReport} />
              <ReportPreview report={generatedReport} isGenerating={isGenerating} />
            </div>
          ) : (
            <ReportPreview report={generatedReport} isGenerating={isGenerating} />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ReportGeneratorEnhanced;