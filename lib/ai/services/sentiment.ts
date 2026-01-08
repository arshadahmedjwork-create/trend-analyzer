import { queryModel } from "../gateway";

export interface SentimentResult {
    label: string;
    score: number;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
    const response = await queryModel("cardiffnlp/twitter-roberta-base-sentiment-latest", {
        inputs: text,
        parameters: {}
    });

    return {
        label: response.label,
        score: response.score
    };
}