/**
 * AI Service for content generation and writing assistance.
 * This is a simulated version until an API key is provided.
 */

export interface AIResponse {
    content: string;
    error?: string;
}

export const generateContent = async (prompt: string, type: 'seo' | 'writing' | 'excerpt' | 'summary'): Promise<AIResponse> => {
    console.log(`[AI Service] Generating ${type} for prompt: ${prompt.substring(0, 50)}...`);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Placeholder responses
    switch (type) {
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
