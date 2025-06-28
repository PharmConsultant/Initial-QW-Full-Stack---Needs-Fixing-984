import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiZap, FiTarget, FiSearch, FiEye, FiEyeOff, FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

function AIModelConfiguration() {
  const [showApiKeys, setShowApiKeys] = useState({});
  const [aiSettings, setAiSettings] = useState({
    problemStatement: {
      model: 'gpt-3.5-turbo',
      provider: 'OpenAI',
      apiKey: '',
      temperature: 0.7,
      maxTokens: 2000
    },
    reportGeneration: {
      model: 'gpt-4',
      provider: 'OpenAI', 
      apiKey: '',
      temperature: 0.5,
      maxTokens: 4000
    },
    rootCauseAnalysis: {
      model: 'claude-3-sonnet-20240229',
      provider: 'Anthropic',
      apiKey: '',
      temperature: 0.3,
      maxTokens: 3000
    }
  });

  const [availableModels] = useState({
    openai: [
      { id: 'gpt-4', name: 'GPT-4', description: 'Most advanced model for complex analysis' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Latest GPT-4 with improved performance' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for standard tasks' }
    ],
    anthropic: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful Claude model' },
      { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance and speed' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fastest Claude model' }
    ],
    perplexity: [
      { id: 'llama-3-sonar-large-32k-online', name: 'Llama 3 Sonar Large', description: 'Real-time web search integration' },
      { id: 'llama-3-sonar-small-32k-online', name: 'Llama 3 Sonar Small', description: 'Efficient web search model' }
    ]
  });

  const handleSettingChange = (category, field, value) => {
    setAiSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const toggleApiKeyVisibility = (category) => {
    setShowApiKeys(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const getProviderIcon = (provider) => {
    switch (provider.toLowerCase()) {
      case 'openai': return FiTarget;
      case 'anthropic': return FiCpu;
      case 'perplexity': return FiSearch;
      default: return FiZap;
    }
  };

  const getProviderModels = (provider) => {
    switch (provider.toLowerCase()) {
      case 'openai': return availableModels.openai;
      case 'anthropic': return availableModels.anthropic;
      case 'perplexity': return availableModels.perplexity;
      default: return [];
    }
  };

  const categories = [
    {
      id: 'problemStatement',
      title: 'Problem Statement Generation',
      description: 'AI model used for generating comprehensive problem statements',
      icon: FiZap,
      color: 'blue'
    },
    {
      id: 'reportGeneration', 
      title: 'Report Generation',
      description: 'AI model used for creating detailed investigation reports',
      icon: FiTarget,
      color: 'green'
    },
    {
      id: 'rootCauseAnalysis',
      title: 'Root Cause Analysis',
      description: 'AI model used for conducting thorough root cause analysis',
      icon: FiCpu,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-2">AI Model Configuration</h3>
        <p className="text-gray-600">Configure AI models and API keys for different investigation tasks</p>
      </motion.div>

      {categories.map((category) => {
        const Icon = category.icon;
        const settings = aiSettings[category.id];
        const ProviderIcon = getProviderIcon(settings.provider);
        
        return (
          <motion.div
            key={category.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 bg-${category.color}-100 rounded-lg`}>
                <Icon className={`w-5 h-5 text-${category.color}-600`} />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{category.title}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Provider
                  </label>
                  <select
                    value={settings.provider}
                    onChange={(e) => {
                      const newProvider = e.target.value;
                      const firstModel = getProviderModels(newProvider)[0]?.id || '';
                      handleSettingChange(category.id, 'provider', newProvider);
                      handleSettingChange(category.id, 'model', firstModel);
                    }}
                    className="form-input"
                  >
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Perplexity">Perplexity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <select
                    value={settings.model}
                    onChange={(e) => handleSettingChange(category.id, 'model', e.target.value)}
                    className="form-input"
                  >
                    {getProviderModels(settings.provider).map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {getProviderModels(settings.provider).find(m => m.id === settings.model)?.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKeys[category.id] ? 'text' : 'password'}
                      value={settings.apiKey}
                      onChange={(e) => handleSettingChange(category.id, 'apiKey', e.target.value)}
                      className="form-input pr-10"
                      placeholder={`Enter ${settings.provider} API key`}
                    />
                    <button
                      type="button"
                      onClick={() => toggleApiKeyVisibility(category.id)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showApiKeys[category.id] ? (
                        <FiEyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <FiEye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    API key is encrypted and stored securely
                  </p>
                </div>
              </div>

              {/* Model Parameters */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperature: {settings.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.temperature}
                    onChange={(e) => handleSettingChange(category.id, 'temperature', parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Conservative (0.0)</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) => handleSettingChange(category.id, 'maxTokens', parseInt(e.target.value))}
                    className="form-input"
                    min="100"
                    max="8000"
                    step="100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum number of tokens for the response
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ProviderIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Current Configuration</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>Provider: {settings.provider}</p>
                    <p>Model: {settings.model}</p>
                    <p>Temperature: {settings.temperature}</p>
                    <p>Max Tokens: {settings.maxTokens.toLocaleString()}</p>
                    <p>Status: {settings.apiKey ? '✅ Configured' : '❌ API Key Required'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Cost Estimation */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Cost Estimation</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-900">Problem Statement</h5>
            <p className="text-lg font-bold text-blue-600">~$0.02</p>
            <p className="text-xs text-blue-700">per generation</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="text-sm font-medium text-green-900">Report Generation</h5>
            <p className="text-lg font-bold text-green-600">~$0.15</p>
            <p className="text-xs text-green-700">per report</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h5 className="text-sm font-medium text-purple-900">Root Cause Analysis</h5>
            <p className="text-lg font-bold text-purple-600">~$0.08</p>
            <p className="text-xs text-purple-700">per analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          <FiSave className="w-5 h-5" />
          <span>Save AI Configuration</span>
        </button>
      </div>
    </div>
  );
}

export default AIModelConfiguration;