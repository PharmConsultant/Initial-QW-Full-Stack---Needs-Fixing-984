import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDeviation } from '../../../context/DeviationContext';
import { FiSearch, FiTrendingUp, FiAlertTriangle } from 'react-icons/fi';

function TrendingStep() {
  const { formData, updateFormData } = useDeviation();
  const data = formData.trending || {};
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = (field, value) => {
    updateFormData('trending', { [field]: value });
  };

  // Mock historical data for demonstration
  const mockHistoricalData = [
    {
      id: 'DEV-2023-045',
      title: 'Temperature excursion in cold storage area',
      date: '2023-12-15',
      similarity: 95,
      rootCause: 'HVAC system malfunction'
    },
    {
      id: 'DEV-2023-023',
      title: 'Cold chain deviation during storage',
      date: '2023-08-22',
      similarity: 87,
      rootCause: 'Temperature monitoring system failure'
    },
    {
      id: 'DEV-2023-012',
      title: 'Refrigeration unit temperature alarm',
      date: '2023-05-10',
      similarity: 78,
      rootCause: 'Preventive maintenance overdue'
    }
  ];

  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Simulate search with mock data
      const results = mockHistoricalData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.rootCause.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setHasSearched(true);
      handleChange('searchQuery', searchQuery);
      handleChange('searchResults', results);
    }
  };

  const trendingCategories = [
    'Equipment/System Failures',
    'Human Error/Training',
    'Environmental Conditions',
    'Material/Supply Chain',
    'Process/Procedure Issues',
    'Documentation Errors'
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Historical Deviation Search
        </h4>
        <div className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              placeholder="Search for similar deviations (keywords, equipment, process)..."
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiSearch className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {hasSearched && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-3">
            Search Results ({searchResults.length} found)
          </h5>
          {searchResults.length === 0 ? (
            <p className="text-gray-500 text-sm">No similar deviations found.</p>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h6 className="font-medium text-gray-900">{result.id}</h6>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {result.similarity}% similar
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{result.title}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Root Cause: {result.rootCause}</span>
                    <span>{result.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trending Category Classification *
        </label>
        <select
          value={data.trendingCategory || ''}
          onChange={(e) => handleChange('trendingCategory', e.target.value)}
          className="form-input"
          required
        >
          <option value="">Select Category</option>
          {trendingCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trending Analysis *
        </label>
        <textarea
          value={data.trendingAnalysis || ''}
          onChange={(e) => handleChange('trendingAnalysis', e.target.value)}
          className="form-textarea"
          rows="4"
          placeholder="Analyze patterns, trends, and relationships with historical deviations..."
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frequency Assessment
        </label>
        <select
          value={data.frequencyAssessment || ''}
          onChange={(e) => handleChange('frequencyAssessment', e.target.value)}
          className="form-input"
        >
          <option value="">Select Frequency</option>
          <option value="isolated">Isolated Incident</option>
          <option value="infrequent">Infrequent (less than 3 times/year)</option>
          <option value="occasional">Occasional (3-6 times/year)</option>
          <option value="frequent">Frequent (more than 6 times/year)</option>
          <option value="recurring">Recurring Pattern</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System-Wide Impact Assessment
        </label>
        <textarea
          value={data.systemWideImpact || ''}
          onChange={(e) => handleChange('systemWideImpact', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Assess potential impact on other systems, processes, or products..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trending Keywords/Tags
        </label>
        <input
          type="text"
          value={data.trendingTags || ''}
          onChange={(e) => handleChange('trendingTags', e.target.value)}
          className="form-input"
          placeholder="Enter keywords separated by commas (e.g., temperature, HVAC, storage)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preventive Measures Recommended
        </label>
        <textarea
          value={data.preventiveMeasures || ''}
          onChange={(e) => handleChange('preventiveMeasures', e.target.value)}
          className="form-textarea"
          rows="4"
          placeholder="Based on trending analysis, what preventive measures should be considered system-wide?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Trending Review Recommendations
        </label>
        <textarea
          value={data.reviewRecommendations || ''}
          onChange={(e) => handleChange('reviewRecommendations', e.target.value)}
          className="form-textarea"
          rows="3"
          placeholder="Recommendations for ongoing trending review and monitoring..."
        />
      </div>

      {/* Trending Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <FiTrendingUp className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-semibold text-blue-900">
              Trending Insights
            </h4>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <p>Similar deviations found: {searchResults.length}</p>
            <p>Category: {data.trendingCategory || 'Not selected'}</p>
            <p>Frequency: {data.frequencyAssessment || 'Not assessed'}</p>
          </div>
        </div>

        {searchResults.length >= 2 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FiAlertTriangle className="w-5 h-5 text-yellow-600" />
              <h4 className="text-sm font-semibold text-yellow-900">
                Trend Alert
              </h4>
            </div>
            <div className="text-sm text-yellow-800">
              <p>Multiple similar deviations detected.</p>
              <p>Consider system-wide preventive actions.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default TrendingStep;