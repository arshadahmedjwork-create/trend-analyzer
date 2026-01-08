import React, { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import './App.css';

function App() {
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedModelType, setSelectedModelType] = useState<string>('text');

  const handleModelSelect = (modelId: string, modelType: string) => {
    setSelectedModel(modelId);
    setSelectedModelType(modelType);
    console.log(`Selected model: ${modelId} (${modelType})`);
  };

  const callPythonAPI = async (prompt: string) => {
    try {
      const response = await fetch('http://localhost:5001/infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inputs: prompt,
          model_id: selectedModel || undefined,
          model_type: selectedModelType,
          parameters: {}
        })
      });
      // Handle response
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error calling Python API:', error);
    }
  };

  return (
    <div className="App">
      <ModelSelector
        onModelSelect={handleModelSelect}
        selectedModel={selectedModel}
        selectedType={selectedModelType}
      />
      {/* Your main content here */}
    </div>
  );
}

export default App;