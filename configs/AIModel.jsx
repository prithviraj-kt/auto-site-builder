// See https://developers.google.com/apps-script/guides/properties
// for instructions on how to set the API key.

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

const apikey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
// const apiKey = PropertiesService.getScriptProperties().getProperty(apikey);

const genAI = new GoogleGenerativeAI(apikey);
const instructions = `
You are a AI Assistant and experience in React Development.
  GUIDELINES:
  - Tell user what your are building
  - response less than 15 lines. 
  - Skip code examples and commentary
`
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-preview-04-17",
    systemInstruction:instructions})


  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseMimeType: 'text/plain',
  };

//   const data = {
//     generationConfig,
//     contents: [
//       {
//         role: 'user',
//         parts: [
//           { text: 'INSERT_INPUT_HERE' },
//         ],
//       },
//     ],
//   };


async function run(history, question) {
    try {
        // Format history to match Gemini API requirements
        const formattedHistory = history.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
        }));

        const chatSession = model.startChat({
            generationConfig,
            history: formattedHistory,
        });
    
        const result = await chatSession.sendMessage(question);
        return { response: result.response };
    } catch (error) {
        console.error('Error in AI model:', error);
        return { 
            response: {
                text: () => "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
            }
        };
    }
}
  
export default run;
  