import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        success: true,
        featured_models: {
            text: [
                "Qwen/Qwen3-4B",
                "microsoft/Phi-3-mini-4k-instruct",
                "meta-llama/Llama-3.2-11B-Vision-Instruct"
            ],
            image: [
                "google/gemma-3-4b-it"
            ],
            video: [
                "llava-hf/LLaVA-NeXT-Video-7B-hf"
            ],
            audio: [
                "Qwen/Qwen2-Audio-7B-Instruct"
            ]
        },
        defaults: {
            text: "Qwen/Qwen3-4B",
            image: "google/gemma-3-4b-it",
            video: "llava-hf/LLaVA-NeXT-Video-7B-hf",
            audio: "Qwen/Qwen2-Audio-7B-Instruct"
        }
    });
}
