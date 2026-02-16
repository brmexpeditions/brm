/**
 * AI Service for content generation and writing assistance.
 * This is a simulated version until an API key is provided.
 */

export interface AIResponse {
    content: string;
    error?: string;
}

export const generateContent = async (prompt: string, type: 'seo' | 'writing' | 'excerpt' | 'summary' | 'design'): Promise<AIResponse> => {
    console.log(`[AI Service] Generating ${type} for prompt: ${prompt.substring(0, 50)}...`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder responses
    switch (type) {
        case 'design':
            const lowerPrompt = prompt.toLowerCase();
            let design = {
                colors: {
                    primary: "#f59e0b",
                    secondary: "#1f2937",
                    accent: "#ea580c",
                    background: "#f9fafb",
                    text: "#111827",
                    textLight: "#6b7280"
                },
                typography: {
                    headingFont: "Inter",
                    bodyFont: "Inter",
                    baseFontSize: 16,
                    lineHeight: 1.6
                }
            };

            if (lowerPrompt.includes('dark') || lowerPrompt.includes('night')) {
                design.colors.primary = "#f59e0b";
                design.colors.secondary = "#111827";
                design.colors.background = "#0f172a";
                design.colors.text = "#f8fafc";
                design.colors.textLight = "#94a3b8";
            } else if (lowerPrompt.includes('nature') || lowerPrompt.includes('forest') || lowerPrompt.includes('green')) {
                design.colors.primary = "#059669";
                design.colors.secondary = "#064e3b";
                design.colors.accent = "#10b981";
                design.typography.headingFont = "Playfair Display";
            } else if (lowerPrompt.includes('luxury') || lowerPrompt.includes('gold') || lowerPrompt.includes('premium')) {
                design.colors.primary = "#b45309";
                design.colors.secondary = "#1a1a1a";
                design.colors.background = "#ffffff";
                design.colors.accent = "#d97706";
                design.typography.headingFont = "Cinzel";
            } else if (lowerPrompt.includes('sport') || lowerPrompt.includes('fast') || lowerPrompt.includes('red')) {
                design.colors.primary = "#dc2626";
                design.colors.secondary = "#111827";
                design.colors.accent = "#ef4444";
                design.typography.headingFont = "Orbitron";
            } else if (lowerPrompt.includes('vintage') || lowerPrompt.includes('retro') || lowerPrompt.includes('classic')) {
                design.colors.primary = "#7c2d12";
                design.colors.secondary = "#431407";
                design.colors.background = "#fff7ed";
                design.typography.headingFont = "Lora";
            }

            return {
                content: JSON.stringify(design)
            };
        case 'seo':
            return {
                content: JSON.stringify({
                    metaTitle: "Optimized SEO Title | BRM Expeditions",
                    metaDescription: "This is a professional AI-generated meta description that highlights the key aspects of your content to improve CTR.",
                    keywords: ["motorcycle tours", "adventure", "travel", "expedition"]
                })
            };
        case 'excerpt':
            return {
                content: "A compelling short summary of your post that will entice readers to click and read more about your motorcycle adventure."
            };
        case 'writing':
            return {
                content: "Your writing, but better! AI has improved the flow, grammar, and tone of your content while preserving your original message."
            };
        case 'summary':
            return {
                content: "In summary, this content covers the essential aspects of motorcycle touring with BRM Expeditions, focusing on safety, adventure, and local culture."
            };
        default:
            return { content: "AI-generated content would appear here." };
    }
};
