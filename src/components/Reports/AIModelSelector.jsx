import React from 'react';
import { FiCpu, FiZap, FiTarget, FiSearch } from 'react-icons/fi';

function AIModelSelector({ selectedModel, onModelChange }) {
  const models = [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'OpenAI',
      icon: FiTarget,
      description: 'Most advanced model for complex analysis',
      features: ['Superior reasoning', 'Detailed analysis', 'Regulatory expertise'],
      pricing: '$$$'
    },
    {
      id: 'gpt-3.5',
      name: 'GPT-3.5 Turbo',
      provider: 'OpenAI',
      icon: FiZap,
      description: 'Fast and efficient for standard reports',
      features: ['Quick generation', 'Good accuracy', 'Cost effective'],
      pricing: '$'
    },
    {
      id: 'claude',
      name: 'Claude',
      provider: 'Anthropic',
      icon: FiCpu,
      description: 'Excellent for analytical reasoning',
      features: ['Strong analysis', 'Safety focused', 'Long context'],
      pricing: '$$'
    },
    {
      id: 'perplexity',
      name: 'Perplexity',
      provider: 'Perplexity AI',
      icon: FiSearch,
      description: 'Real-time web search integration',
      features: ['Current data', 'Source citations', 'Web research'],
      pricing: '$$'
    }
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        AI Model Selection
      </label>
      <div className="space-y-3">
        {models.map((model) => {
          const Icon = model.icon;
          return (
            <label
              key={model.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                selectedModel === model.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="aiModel"
                value={model.id}
                checked={selectedModel === model.id}
                onChange={(e) => onModelChange(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 text-blue-600 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {model.name}
                    </h4>
                    <span className="text-xs text-gray-500">{model.pricing}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{model.provider}</p>
                  <p className="text-sm text-gray-600 mb-2">{model.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {model.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default AIModelSelector;