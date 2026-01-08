import { NextResponse } from "next/server";
import { analyzeTrends } from "@/lib/ai/services/trendAnalyzer";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const model = searchParams.get('model') || "Qwen/Qwen3-4B";
        
        console.log("[Trends API] Fetching trends with model:", model);
        
        const trends = await analyzeTrends(model);
        
        return NextResponse.json({
            success: true,
            trends,
            lastUpdated: new Date().toISOString()
        });
    } catch (error: any) {
        console.error("[Trends API] Error:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: error.message || "Failed to fetch trends" 
            },
            { status: 500 }
        );
    }
}
