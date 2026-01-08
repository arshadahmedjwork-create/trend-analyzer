import { queryModel } from "../gateway";

const MODEL_ID = "efederici/sentence-BERTino";

export async function generateEmbeddings(text: string, modelId = "sentence-transformers/all-MiniLM-L6-v2") {
    // Ensure text is a string
    const inputText = Array.isArray(text) ? text.join(' ') : String(text);
    const result = await queryModel(modelId, inputText, 'text');
    return result;
}
