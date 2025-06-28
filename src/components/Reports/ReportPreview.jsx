import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiShield, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

function ReportPreview({ report, isGenerating }) {
  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Generating AI-Powered Report
            </h3>
            <p className="text-gray-600">
              Processing deviation data and generating compliant documentation...
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <p>✓ Analyzing deviation data</p>
              <p>✓ Applying regulatory templates</p>
              <p>⏳ Generating comprehensive report...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center h-96 flex items-center justify-center">
          <div>
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Report Generated
            </h3>
            <p className="text-gray-600">
              Select a deviation and click "Generate Report" to create a comprehensive investigation report.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{report.title}</h2>
            <p className="text-gray-600 mt-1">
              Generated on {format(new Date(report.generatedAt), 'PPP')} using {report.model}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <FiShield className="w-5 h-5" />
            <span className="text-sm font-medium">FDA Compliant</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 space-y-8 max-h-96 overflow-y-auto">
        {/* Executive Summary */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Executive Summary</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {report.content.executiveSummary}
          </p>
        </section>

        {/* Deviation Details */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Deviation Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">ID:</span>
              <span className="ml-2 text-gray-900">{report.content.deviationDetails.id}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Classification:</span>
              <span className="ml-2 text-gray-900">{report.content.deviationDetails.classification}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Date Occurred:</span>
              <span className="ml-2 text-gray-900">{report.content.deviationDetails.dateOccurred}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Area:</span>
              <span className="ml-2 text-gray-900">{report.content.deviationDetails.area}</span>
            </div>
          </div>
          <div className="mt-3">
            <span className="font-medium text-gray-600">Description:</span>
            <p className="mt-1 text-gray-700 text-sm">
              {report.content.deviationDetails.description}
            </p>
          </div>
        </section>

        {/* Investigation Summary */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Investigation Summary</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600">Methodology:</span>
              <span className="ml-2 text-gray-900">{report.content.investigation.methodology}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Root Cause:</span>
              <p className="mt-1 text-gray-700">{report.content.investigation.rootCause}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600">Key Findings:</span>
              <p className="mt-1 text-gray-700">{report.content.investigation.findings}</p>
            </div>
          </div>
        </section>

        {/* Risk Assessment */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Risk Assessment</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">RPN Score:</span>
              <span className="ml-2 text-gray-900 font-bold">{report.content.riskAssessment.rpn}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Classification:</span>
              <span className="ml-2 text-gray-900">{report.content.riskAssessment.classification}</span>
            </div>
          </div>
        </section>

        {/* CAPA Actions */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">CAPA Actions</h3>
          <div className="space-y-3">
            {report.content.capa.map((action, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {action.type} Action #{index + 1}
                  </span>
                  <span className="text-xs text-gray-500">Due: {action.dueDate}</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Owner:</span> {action.owner} |{' '}
                  <span className="font-medium">Effectiveness:</span> {action.effectiveness}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Conclusion */}
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Conclusion</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {report.content.conclusion}
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-gray-50 rounded-b-xl border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <FiCheckCircle className="w-4 h-4 text-green-600" />
              <span>ALCOA++ Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiShield className="w-4 h-4 text-blue-600" />
              <span>21 CFR 210/211</span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Report ID: {report.id}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ReportPreview;