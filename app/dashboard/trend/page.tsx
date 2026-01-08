"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TrendData {
    category: string;
    description: string;
    score: number;
    hashtags: string[];
    examples: string[];
}

// Default fallback trends (shown immediately)
const defaultTrends: TrendData[] = [
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

export default function TrendPage() {
    const [trends, setTrends] = useState<TrendData[]>(defaultTrends);
    const [loading, setLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<string>("Cached data");
    const [error, setError] = useState("");

    const fetchTrends = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch('/api/trends');
            const data = await res.json();
            
            if (data.success) {
                setTrends(data.trends);
                setLastUpdated(new Date(data.lastUpdated).toLocaleString());
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return "text-green-400";
        if (score >= 75) return "text-yellow-400";
        return "text-orange-400";
    };

    return (
        <div className="space-y-8 p-4 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Instagram Trend Analysis</h1>
                    <p className="text-sm md:text-base text-gray-400">Real-time viral trends powered by AI</p>
                    <p className="text-xs text-gray-500 mt-1">Last updated: {lastUpdated}</p>
                </div>
                <Button 
                    onClick={fetchTrends} 
                    disabled={loading}
                    className="bg-white text-black hover:bg-gray-200 w-full md:w-auto"
                >
                    {loading ? "Analyzing Trends..." : "Refresh with AI"}
                </Button>
            </div>

            {error && (
                <div className="bg-red-900/10 border border-red-900 text-red-400 p-3 md:p-4 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {trends.map((trend, index) => (
                    <div 
                        key={index} 
                        className="border border-zinc-800 p-4 md:p-6 rounded-lg bg-zinc-900/50 hover:bg-zinc-900 transition-all hover:border-zinc-700"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <h3 className="text-lg md:text-xl font-bold text-white">{trend.category}</h3>
                            <span className={`text-xl md:text-2xl font-bold ${getScoreColor(trend.score)}`}>
                                {trend.score}
                            </span>
                        </div>
                        
                        <p className="text-xs md:text-sm text-gray-400 mb-4 leading-relaxed">
                            {trend.description}
                        </p>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1 font-semibold">Trending Hashtags</p>
                                <div className="flex flex-wrap gap-2">
                                    {trend.hashtags.map((tag, i) => (
                                        <span 
                                            key={i} 
                                            className="text-xs bg-zinc-800 text-blue-400 px-2 py-1 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1 font-semibold">Examples</p>
                                <ul className="text-xs text-gray-400 space-y-1">
                                    {trend.examples.map((example, i) => (
                                        <li key={i}>• {example}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="text-center text-gray-400 text-sm">
                    <p>Analyzing current Instagram trends...</p>
                    <p className="text-xs mt-1">This may take a moment</p>
                </div>
            )}
        </div>
    );
}
