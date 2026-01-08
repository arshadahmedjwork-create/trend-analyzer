import { queryModel } from "../gateway";

const MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct";

export async function generateCaptionReasoning(trendContext: string, imageInsights: string, audioLyrics: string) {
    // Construct a prompt optimized for LLaMA-3
    const prompt = `
You are an expert Instagram Trend Analyst.
Analyze the following inputs and generate a viral caption strategy.

Image Analysis: ${imageInsights}
Audio/Lyrics: ${audioLyrics}
Trend Context: ${trendContext}

Goal: Write a hook (first line) and a caption body that leverages the trend. 
Provide reasoning for why this works.
`;

    const result = await queryModel(MODEL_ID, {
        input: prompt,
        parameters: {
            max_new_tokens: 500,
            temperature: 0.7,
            return_full_text: false
        }
    });

    // Handle HF output format (usually array of generated text)
    return result[0]?.generated_text || "";
}
