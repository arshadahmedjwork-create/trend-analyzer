import React, { useEffect, useState } from 'react';

interface ModelData {
  featured_models: {
    image: string[];
    audio: string[];
    video: string[];
    text: string[];
  };
  defaults: {
    image: string | null;
    audio: string | null;
    video: string | null;
    text: string;
  };
}

interface ModelSelectorProps {
  onModelSelect: (modelId: string, modelType: string) => void;
  selectedModel?: string;
  selectedType?: string;
}

export default function ModelSelector({ onModelSelect, selectedModel, selectedType = 'text' }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(selectedType);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    setActiveType(selectedType);
  }, [selectedType]);

  useEffect(() => {
    // Select default model when models are loaded and no model is selected
    if (models && !selectedModel) {
      const defaultModel = models.defaults[activeType as keyof typeof models.defaults];
      if (defaultModel) {
        onModelSelect(defaultModel, activeType);
      }
    }
  }, [models, activeType]);

  const fetchModels = async () => {
    try {
      const response = await fetch('/api/models');
      const data = await response.json();
      if (data.success) {
        setModels(data);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (modelId: string, type: string) => {
    onModelSelect(modelId, type);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    if (models?.defaults[type as keyof typeof models.defaults]) {
      onModelSelect(models.defaults[type as keyof typeof models.defaults]!, type);
    }
  };

  if (loading) {
    return <div className="text-gray-600">Loading models...</div>;
  }

  if (!models) {
    return <div className="text-red-600">Failed to load models</div>;
  }

  const types = ['text', 'image', 'audio', 'video'] as const;

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4 mb-4">
      <h3 className="text-lg font-semibold mb-3 text-white">Select AI Model</h3>
      
      {/* Type Selector */}
      <div className="flex gap-2 mb-4">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeType === type
                ? 'bg-white text-black'
                : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Model List */}
      <div className="space-y-2">
        {models.featured_models[activeType as keyof typeof models.featured_models].length > 0 ? (
          models.featured_models[activeType as keyof typeof models.featured_models].map((model) => (
            <button
              key={model}
              onClick={() => handleModelSelect(model, activeType)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                selectedModel === model
                  ? 'border-white bg-zinc-800'
                  : 'border-zinc-700 hover:border-zinc-600 bg-zinc-900'
              }`}
            >
              <div className="font-medium text-sm text-white">{model}</div>
              {models.defaults[activeType as keyof typeof models.defaults] === model && (
                <span className="text-xs text-gray-400 font-semibold">✓ Default</span>
              )}
            </button>
          ))
        ) : (
          <div className="text-gray-500 text-center py-4">
            No {activeType} models available
          </div>
        )}
      </div>
    </div>
  );
}
