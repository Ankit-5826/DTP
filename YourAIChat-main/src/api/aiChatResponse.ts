import { GoogleGenAI } from "@google/genai";
import type { Conversation } from "../utils/DataConversationTypes";


let outputRule =
  "---------------Output Rule------------   IMPORTANT: Return ONLY valid, production-ready HTML. Never use Markdown (**bold**, *italic*, # headings, code fences, markdown tables, markdown links, or backticks). Every response must be wrapped in a root <div class='chat-response'>. Use semantic HTML tags such as <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <pre>, <code>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, and <a>. Format answers professionally with clear headings, paragraphs, and lists. Highlight important information using <strong>. Use <pre><code> for code examples. For comparisons, use HTML tables. For step-by-step instructions, use ordered lists. Add proper spacing and structure so the HTML is immediately renderable with innerHTML. Do not include explanations outside the HTML. Do not wrap the HTML in JSON or code blocks. Ensure all tags are properly closed. If the response contains code, escape HTML entities inside code blocks. The output must be visually clean, modern, and ready to display in a chat application without any additional formatting or processing and also add proper css for color, position and what ever need for best formating . Return HTML only.";

const getAiChatResponse = async (
  newMessage: string,
  oldConversations: Conversation[] | undefined,
): Promise<string> => {
  let dataToSend: string = "";
  if (oldConversations) {
    outputRule +=
      "------------Chat history ---------: " + JSON.stringify(oldConversations);
  }
  const apiKey =  localStorage.getItem("API_KEY") || "";
  let ai = new GoogleGenAI({
    apiKey: atob(apiKey),
  });


  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: newMessage + outputRule,
    });
    dataToSend = response.text || "";
  } catch (error: any) {
    if (error instanceof Error) {
      const parsed = JSON.parse(error.message);
      if (parsed.error) {
        throw new Error(parsed.error.message);
      }
    }
    throw new Error("Some Error, Try again in sometime.");
  }
  return dataToSend;
};

export { getAiChatResponse };

