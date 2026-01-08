import { NextResponse } from "next/server";
import { runTrendPipeline, PipelineInput } from "@/lib/ai/pipeline";
import { requireApproval } from "@/lib/auth/server";

export async function POST(request: Request) {
    try {
        // 1. Security Check
        const profile = await requireApproval();

        // 2. Permission Check
        if (!profile.permissions.captionGen) {
            return NextResponse.json(
                { error: "Permission denied: Caption Generation not enabled for this user." },
                { status: 403 }
            );
        }

        // 3. Parse Input
        const body: PipelineInput = await request.json();
        console.log("AI Generate: Request parsed.");
        console.log("Caption:", body.captionText?.substring(0, 50));
        console.log("Model:", body.model || "Qwen/Qwen3-4B (default)");
        console.log("Model Type:", body.modelType || "text");

        // Debug: Log if keys are present (do not log values)
        console.log("Environment Check - HF_TOKEN:", !!process.env.HF_API_TOKEN, "BYTEZ_KEY:", !!process.env.BYTEZ_API_KEY);

        // 4. Run Pipeline
        const output = await runTrendPipeline(body);
        console.log("AI Generate: Pipeline success");
        console.log("Generated", output.variations?.length || 0, "variations");

        return NextResponse.json(output);

    } catch (error: any) {
        console.error("AI Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: error.message.includes("Unauthorized") ? 401 : 500 }
        );
    }
}
