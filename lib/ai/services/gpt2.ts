import { queryModel } from "../gateway";

const MODEL_ID = "openai-community/gpt2";

export async function generateVariations(baseCaption: string) {
    const result = await queryModel(MODEL_ID, {
        input: baseCaption,
        parameters: {
            max_new_tokens: 50,
            num_return_sequences: 3,
            do_sample: true
        }
    });

    return result.map((r: any) => r.generated_text);
}
