import { queryModel } from "./gateway";

export async function classifyTopics(text: string): Promise<string[]> {
    const response = await queryModel("facebook/bart-large-mnli", {
        inputs: text,
        parameters: {}
    });

    return response;
}