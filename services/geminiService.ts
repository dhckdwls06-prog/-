import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

let client: GoogleGenAI | null = null;

const getClient = () => {
  if (!client) {
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const generateCoachResponse = async (
  history: Message[],
  userContext: string
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Convert history to Gemini format
    // We limit history to last 10 messages to keep context focused and save tokens
    const recentHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const model = "gemini-2.5-flash";
    
    // Create a chat session
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Warm and creative but consistent
      },
      history: recentHistory,
    });

    // Send the message with context about the user's current status
    // Note: In a real app, we might inject this as a system prompt update or a hidden user message.
    // Here we append it to the user's prompt if it's the latest message, or handle it simply.
    // For simplicity in this demo, we assume the last message in history is the user's latest input
    // and we are just generating a response. However, `sendMessage` takes a new message.
    // So we will actually pop the last user message from history to send it now.
    
    // Correct approach for this stateless wrapper:
    // We need to send the LAST user message to the chat object which has the PREVIOUS history.
    
    const lastUserMsg = recentHistory.pop(); // Remove last message to send it as 'newMessage'
    
    if (!lastUserMsg || !lastUserMsg.parts[0].text) {
      return "듣고 있어요. 무슨 말씀을 하고 싶으신가요? 😊";
    }

    const contextPrefix = `[사용자 상태 정보: ${userContext}]\n\n`;
    const finalPrompt = contextPrefix + lastUserMsg.parts[0].text;

    const result = await chat.sendMessage({
      message: finalPrompt
    });

    return result.text;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "미안해요, 지금은 제가 잠시 생각을 정리하고 있어요. 잠시 후 다시 말을 걸어주세요. 💦";
  }
};
