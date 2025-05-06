// See https://developers.google.com/apps-script/guides/properties
// for instructions on how to set the API key.

import Prompt from "@/data/Prompt";
import Lookup from "@/data/Lookup";
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
// const apiKey = PropertiesService.getScriptProperties().getProperty(apikey);

const genAI = new GoogleGenerativeAI(apikey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
    systemInstruction: Prompt.CODE_GEN_PROMPT
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseMimeType: 'application/json',
};

const chatSession = model.startChat({
    generationConfig,
    history: [],
});

export default async function generateCode(messages, question, code) {
    try {
        const codeSummary = code ? `\nCurrent code state: ${JSON.stringify(code)}` : '';
        const result = await chatSession.sendMessage(question + codeSummary);
        const res = result.response.text();
        
        try {
            // First, try to parse the response directly
            try {
                return JSON.parse(res);
            } catch (e) {
                // Try to extract the first JSON object from the response
                const match = res.match(/\{[\s\S]*\}/);
                if (match) {
                    try {
                        return JSON.parse(match[0]);
                    } catch (e2) {
                        console.error('Error parsing extracted JSON:', e2, match[0]);
                    }
                }
                // If all fails, log and return default
                console.error('Error parsing code:', e, res);
                return Lookup.DEFAULT_FILE;
            }
        } catch (parseError) {
            console.error('Error parsing code:', parseError);
            return Lookup.DEFAULT_FILE;
        }
    } catch (error) {
        console.error('Error generating code:', error);
        return Lookup.DEFAULT_FILE;
    }
}