import { OpenAI } from "openai";

// Initialize the OpenAI client for Hugging Face Router
const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: import.meta.env.VITE_AI_TOKEN || "",
  dangerouslyAllowBrowser: true // Required to use OpenAI SDK directly in the browser
});

const SYSTEM_PROMPT = "You are a dashboard assistant. ONLY answer using ISS and News dashboard data. Refuse unrelated questions.";

/**
 * Sends a message to the AI Chatbot using the specified DeepSeek model.
 * @param {Array} messageHistory The history of messages in the chat
 * @returns {Promise<string>} The AI's response text
 */
export async function getChatCompletion(messageHistory) {
  if (!import.meta.env.VITE_AI_TOKEN) {
    throw new Error("VITE_AI_TOKEN is not defined in environment variables.");
  }

  // Prepend the system prompt to the messages
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messageHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
  ];

  try {
    const chatCompletion = await client.chat.completions.create({
      model: "deepseek-ai/DeepSeek-V4-Flash:novita",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Chat API Error:", error);
    throw error;
  }
}
