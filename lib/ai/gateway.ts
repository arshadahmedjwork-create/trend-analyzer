// Bytez API Gateway - Direct HTTP calls

const BYTEZ_API_KEY = process.env.NEXT_PUBLIC_BYTEZ_API_KEY || "";
const BYTEZ_API_BASE = "https://api.bytez.com/models/v2";

export async function queryModel(modelId: string, inputs: any, modelType?: string, mediaUrl?: string) {
    try {
        console.log(`[Bytez] Calling model: ${modelId}`);
        
        // For chat/text models, ensure inputs is a string
        let prompt = inputs;
        if (typeof inputs !== 'string') {
            if (Array.isArray(inputs)) {
                prompt = inputs.map(m => m.content || m).join('\n');
            } else if (typeof inputs === 'object') {
                prompt = JSON.stringify(inputs);
            }
        }

        const url = `${BYTEZ_API_BASE}/${modelId}`;
        
        // Check model type
        const isChatModel = modelId.includes('Llama') || modelId.includes('Phi') || modelId.includes('Qwen') || modelId.includes('gemma');
        const isEmbeddingModel = modelId.includes('sentence-transformers') || modelId.includes('all-MiniLM');
        const isMultiModal = mediaUrl && (modelType === 'audio' || modelType === 'image' || modelType === 'video');
        
        let payload;
        if (isMultiModal) {
            // Multimodal models use content array with text and media
            const contentArray: any[] = [
                { type: 'text', text: prompt }
            ];
            
            if (modelType === 'audio') {
                contentArray.push({ type: 'audio', url: mediaUrl });
            } else if (modelType === 'image') {
                contentArray.push({ type: 'image', url: mediaUrl });
            } else if (modelType === 'video') {
                contentArray.push({ type: 'video', url: mediaUrl });
            }
            
            payload = {
                messages: [
                    {
                        role: "user",
                        content: contentArray
                    }
                ],
                stream: false,
                params: {
                    max_length: 500,
                    temperature: 0.7
                }
            };
        } else if (isChatModel) {
            // Chat models use messages format
            payload = {
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                stream: false,
                params: {
                    max_length: 500,
                    temperature: 0.7
                }
            };
        } else if (isEmbeddingModel) {
            // Embedding models use text format
            payload = {
                text: prompt
            };
        } else {
            // Default format
            payload = {
                inputs: prompt
            };
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': BYTEZ_API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Bytez API error: ${response.statusText} - ${errorData}`);
        }

        const result = await response.json();
        
        if (result.error) {
            throw new Error(`Bytez model error: ${result.error}`);
        }

        // Return the output based on model type
        if (isChatModel || isMultiModal) {
            return result.output?.content || result.output;
        } else {
            return result.output || result;
        }

    } catch (error: any) {
        console.error(`[Bytez SDK Error] ${modelId}:`, error);
        throw new Error(`Model API Error: ${error.message || "Unknown Bytez SDK error"}`);
    }
}
