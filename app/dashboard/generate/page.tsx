"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/firebase/config";
import { PipelineOutput } from "@/lib/ai/pipeline";
import ModelSelector from "@/src/components/ModelSelector";
import { Send, Image as ImageIcon, Mic, ChevronDown, Copy, Check } from "lucide-react";

interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    variations?: string[];
    reasoning?: string;
    timestamp: Date;
    imageUrl?: string;
    audioUrl?: string;
}

export default function GeneratePage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showReasoning, setShowReasoning] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [selectedModelType, setSelectedModelType] = useState<string>("text");
    const [showModelSelector, setShowModelSelector] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const audioInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() && !imageFile && !audioFile) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: inputText,
            timestamp: new Date(),
            imageUrl: imagePreview
        };

        setMessages(prev => [...prev, userMessage]);
        setInputText("");
        setImagePreview("");
        setLoading(true);
        setError("");

        try {
            let imageUrl = "";
            let audioUrl = "";

            if (imageFile) {
                imageUrl = await convertToBase64(imageFile);
            }
            if (audioFile) {
                audioUrl = await convertToBase64(audioFile);
            }

            // Build context from previous messages
            const context = messages
                .slice(-4) // Last 4 messages for context
                .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
                .join('\n');

            const token = await auth.currentUser?.getIdToken();

            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    captionText: context ? `${context}\n\nCurrent request: ${inputText}` : inputText,
                    imageUrl,
                    audioUrl,
                    model: selectedModel,
                    modelType: selectedModelType
                }),
            });

            const data: PipelineOutput = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Generation failed");
            }

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "Here are your caption variations:",
                variations: data.variations,
                reasoning: data.generatedReasoning,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
            setImageFile(null);
            setAudioFile(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleModelSelect = (modelId: string, modelType: string) => {
        setSelectedModel(modelId);
        setSelectedModelType(modelType);
        setShowModelSelector(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold">Caption Generator</h1>
                    <p className="text-xs md:text-sm text-gray-400">AI-powered Instagram captions with context</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowModelSelector(!showModelSelector)}
                    className="text-xs md:text-sm"
                >
                    {selectedModel ? selectedModel.split('/').pop() : 'Select Model'}
                </Button>
            </div>

            {/* Model Selector Dropdown */}
            {showModelSelector && (
                <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <ModelSelector
                        onModelSelect={handleModelSelect}
                        selectedModel={selectedModel}
                        selectedType={selectedModelType}
                    />
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="text-4xl md:text-6xl">✨</div>
                        <h2 className="text-xl md:text-2xl font-semibold">Start a conversation</h2>
                        <p className="text-sm md:text-base text-gray-400 max-w-md px-4">
                            Describe your content, upload an image, or provide context. I'll generate viral-worthy captions with full conversation history.
                        </p>
                    </div>
                )}

                {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'bg-white text-black' : 'bg-zinc-900'} rounded-2xl p-4`}>
                            {message.role === 'user' ? (
                                <div className="space-y-2">
                                    {message.imageUrl && (
                                        <img src={message.imageUrl} alt="Uploaded" className="rounded-lg max-h-48 w-full object-cover" />
                                    )}
                                    <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm md:text-base text-gray-300">{message.content}</p>
                                    
                                    {message.variations && (
                                        <div className="space-y-2">
                                            {message.variations.map((caption, i) => (
                                                <div key={i} className="bg-black rounded-lg p-3 relative group">
                                                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed pr-8">{caption}</p>
                                                    <button
                                                        onClick={() => copyToClipboard(caption, `${message.id}-${i}`)}
                                                        className="absolute top-2 right-2 p-1 rounded hover:bg-zinc-800 transition-colors"
                                                    >
                                                        {copiedId === `${message.id}-${i}` ? (
                                                            <Check className="w-4 h-4 text-green-400" />
                                                        ) : (
                                                            <Copy className="w-4 h-4 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {message.reasoning && (
                                        <div className="border-t border-zinc-800 pt-3">
                                            <button
                                                onClick={() => setShowReasoning(showReasoning === message.id ? null : message.id)}
                                                className="flex items-center gap-2 text-xs md:text-sm text-gray-400 hover:text-white transition-colors"
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform ${showReasoning === message.id ? 'rotate-180' : ''}`} />
                                                Strategic Reasoning
                                            </button>
                                            {showReasoning === message.id && (
                                                <p className="text-xs md:text-sm text-gray-400 mt-2 leading-relaxed whitespace-pre-wrap">
                                                    {message.reasoning}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="text-[10px] md:text-xs text-gray-500 mt-2">
                                {message.timestamp.toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-zinc-900 rounded-2xl p-4">
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-900/20 border border-red-900 text-red-400 rounded-lg p-3 text-sm">
                        {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-zinc-800 p-4">
                {imagePreview && (
                    <div className="mb-3 relative inline-block">
                        <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
                        <button
                            onClick={() => { setImagePreview(""); setImageFile(null); }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className="flex items-end gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                    <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                        className="hidden"
                    />

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="shrink-0"
                        disabled={loading}
                    >
                        <ImageIcon className="w-4 h-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => audioInputRef.current?.click()}
                        className="shrink-0 hidden md:flex"
                        disabled={loading}
                    >
                        <Mic className="w-4 h-4" />
                    </Button>

                    <div className="flex-1 bg-zinc-900 rounded-lg border border-zinc-800 focus-within:border-zinc-700">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder="Describe your content or ask for caption variations..."
                            className="w-full bg-transparent px-4 py-3 text-sm md:text-base resize-none outline-none"
                            rows={1}
                            disabled={loading}
                        />
                    </div>

                    <Button
                        onClick={handleSend}
                        disabled={loading || (!inputText.trim() && !imageFile && !audioFile)}
                        size="icon"
                        className="bg-white text-black hover:bg-gray-200 shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </div>

                <p className="text-[10px] md:text-xs text-gray-500 mt-2 text-center">
                    Press Enter to send, Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}
