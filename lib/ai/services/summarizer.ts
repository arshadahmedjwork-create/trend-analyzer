import { queryModel } from "../gateway";

export async function generateSummary(text: string): Promise<string> {
    const response = await queryModel("bartowski/Llama-3.2-3B-Instruct-GGUF", {
        inputs: text,
        parameters: {
            max_new_tokens: 128
        }
    });

    return response;
}