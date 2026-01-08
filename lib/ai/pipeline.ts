import { generateEmbeddings } from "./services/sbert";
import { queryModel } from "./gateway";

export interface PipelineInput {
    captionText?: string;
    imageUrl?: string;
    audioUrl?: string;
    videoUrl?: string;
    model?: string;
    modelType?: string;
}

export interface PipelineOutput {
    variations: string[];
    generatedReasoning: string;
    embedding?: any;
    imageAnalysis?: string;
    audioAnalysis?: string;
    videoAnalysis?: string;
    trendAnalysis?: any;
    imageInsights?: any;
    audioTranscription?: string;
    generatedCaption?: string;
}

export async function runTrendPipeline(input: PipelineInput): Promise<PipelineOutput> {
    const { captionText, imageUrl, audioUrl, videoUrl, model, modelType } = input;

    console.log("[Pipeline] Starting with:", { 
        captionText, 
        hasImage: !!imageUrl, 
        hasAudio: !!audioUrl, 
        hasVideo: !!videoUrl,
        model, 
        modelType 
    });

    const selectedModel = model || "Qwen/Qwen3-4B";
    let fullContext = captionText || "";
    
    // STEP 1: Analyze media FIRST (only if provided)
    let imageAnalysis = "";
    if (imageUrl) {
        console.log("[Pipeline] Analyzing image...");
        const imageModel = "google/gemma-3-4b-it";
        imageAnalysis = await queryModel(
            imageModel,
            "Describe this image in detail: visual elements, colors, mood, composition, text, objects, and anything relevant for social media.",
            'image',
            imageUrl
        );
        fullContext += `\n\nImage Context: ${imageAnalysis}`;
        console.log("[Pipeline] Image analyzed");
    }

    let audioAnalysis = "";
    if (audioUrl) {
        console.log("[Pipeline] Analyzing audio...");
        const audioModel = "Qwen/Qwen2-Audio-7B-Instruct";
        audioAnalysis = await queryModel(
            audioModel,
            "Describe this audio: sounds, music, voices, ambient noise, mood, and emotion.",
            'audio',
            audioUrl
        );
        fullContext += `\n\nAudio Context: ${audioAnalysis}`;
        console.log("[Pipeline] Audio analyzed");
    }
    
    let videoAnalysis = "";
    if (videoUrl) {
        console.log("[Pipeline] Analyzing video...");
        const videoModel = "llava-hf/LLaVA-NeXT-Video-7B-hf";
        videoAnalysis = await queryModel(
            videoModel,
            "Describe this video: what's happening, who/what is in it, setting, mood, and key moments.",
            'video',
            videoUrl
        );
        fullContext += `\n\nVideo Context: ${videoAnalysis}`;
        console.log("[Pipeline] Video analyzed");
    }

    // Generate embeddings from full context
    const embeddingResult = fullContext ? await generateEmbeddings(fullContext) : null;
    console.log("[Pipeline] Embeddings generated");

    // STEP 2: Generate 3 perfect captions with FULL context
    const captionPrompt = `You are an expert Instagram caption writer. Create 3 viral-worthy, copy-paste ready Instagram captions.

CONTEXT:
${fullContext}

REQUIREMENTS:
- Start with a powerful hook that grabs attention
- Include a call-to-action or engaging question
- Add 5-8 trending, relevant hashtags at the end
- Keep each caption 100-150 characters
- Make it sound authentic and relatable
- Each caption should feel complete and ready to post

Return ONLY the 3 captions, one per line. No numbering, no labels, just the captions.`;

    console.log(`[Pipeline] Generating captions with ${selectedModel}`);
    const variationsText = await queryModel(selectedModel, captionPrompt, 'text');

    const variations = variationsText
        .split('\n')
        .filter((line: string) => line.trim().length > 0 && !line.match(/^\d+[.)]\s/))
        .map((line: string) => line.replace(/^["'`\-–—]\s*/, '').replace(/\s*["'`]$/, '').trim())
        .slice(0, 3);

    console.log("[Pipeline] Captions generated:", variations.length);

    // STEP 3: Generate strategic reasoning (shown in dropdown)
    const reasoningPrompt = `Analyze this Instagram content for viral potential:

${fullContext}

Provide concise strategic reasoning with:
1. **Trend Analysis**: Current trends relevant to this content
2. **Engagement Factors**: Key elements (hooks, CTAs) that drive engagement
3. **Platform Optimization**: Instagram-specific tips (Stories, Reels, hashtags)
4. **Reach Recommendations**: Actionable tips for maximum visibility

Keep it brief and actionable.`;

    console.log(`[Pipeline] Generating reasoning with ${selectedModel}`);
    const generatedReasoning = await queryModel(selectedModel, reasoningPrompt, 'text');

    console.log("[Pipeline] Complete");

    return {
        variations,
        generatedReasoning,
        embedding: embeddingResult,
        imageAnalysis,
        audioAnalysis,
        videoAnalysis
    };
}