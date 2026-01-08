import { queryModel } from "../gateway";

interface TrendData {
    category: string;
    description: string;
    score: number;
    hashtags: string[];
    examples: string[];
}

export async function analyzeTrends(model: string = "Qwen/Qwen3-4B"): Promise<TrendData[]> {
    const prompt = `As an Instagram trend analyst, provide current viral trends analysis for ${new Date().toLocaleDateString()}.

Analyze and return 6 trending categories in this exact JSON format:
[
    {
        "category": "Content Format",
        "description": "Brief description of the trend",
        "score": 85,
        "hashtags": ["#trend1", "#trend2"],
        "examples": ["Example 1", "Example 2"]
    }
]

Categories to cover:
1. Content Format (Reels length, editing style)
2. Audio Trends (Trending sounds, music)
3. Visual Style (Colors, filters, aesthetics)
4. Caption Style (Tone, length, hooks)
5. Engagement Tactics (CTAs, questions, polls)
6. Algorithm Insights (Best posting times, content types)

Return ONLY valid JSON array, no additional text.`;

    console.log("[TrendAnalyzer] Fetching latest Instagram trends...");
    
    const response = await queryModel(model, prompt, 'text');
    
    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error("No JSON found in response");
        }
        
        const trends = JSON.parse(jsonMatch[0]);
        console.log("[TrendAnalyzer] Trends analyzed:", trends.length);
        return trends;
    } catch (error) {
        console.error("[TrendAnalyzer] Failed to parse trends:", error);
        // Return fallback trends
        return getFallbackTrends();
    }
}

function getFallbackTrends(): TrendData[] {
    return [
        {
            category: "Content Format",
            description: "Short-form Reels under 15s are dominating. Quick cuts and fast pacing drive retention.",
            score: 92,
            hashtags: ["#reels", "#shortform", "#viral"],
            examples: ["7-second hooks", "Quick transitions", "Loop-friendly content"]
        },
        {
            category: "Audio Trends",
            description: "Sped-up versions of popular songs and nostalgic sounds are trending.",
            score: 88,
            hashtags: ["#spedup", "#trending", "#audio"],
            examples: ["90s remixes", "Sped-up pop hits", "Movie dialogues"]
        },
        {
            category: "Visual Style",
            description: "High contrast B&W edits and vintage film aesthetics are gaining traction.",
            score: 85,
            hashtags: ["#aesthetic", "#vintage", "#film"],
            examples: ["Film grain overlays", "Moody lighting", "Retro filters"]
        },
        {
            category: "Caption Style",
            description: "Conversational, story-driven captions with authentic voice are performing best.",
            score: 90,
            hashtags: ["#storytelling", "#authentic", "#real"],
            examples: ["Personal anecdotes", "Relatable humor", "Raw vulnerability"]
        },
        {
            category: "Engagement Tactics",
            description: "Question-based CTAs and 'comment your answer' prompts drive high engagement.",
            score: 87,
            hashtags: ["#engagement", "#comment", "#interactive"],
            examples: ["This or that?", "Tag someone who...", "Drop a 🔥 if..."]
        },
        {
            category: "Algorithm Insights",
            description: "Posting during 6-9 AM and 7-10 PM yields highest reach. Carousels get 3x more saves.",
            score: 91,
            hashtags: ["#algorithm", "#instagramtips", "#growth"],
            examples: ["Peak posting times", "Carousel posts", "Save-worthy content"]
        }
    ];
}
