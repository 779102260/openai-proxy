import OpenAI from "openai";

const API_KEY = process.env.API_KEY;

/** openai 对话接口 */
export async function conversation(prompt: string, apiKey = API_KEY) {
    try {
        if (!apiKey) {
            throw new Error("Missing required API_KEY");
        }
        const openai = new OpenAI({
            apiKey: apiKey || API_KEY,
        })
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'gpt-3.5-turbo',
        });

        // 处理toomany request情况
        const content = chatCompletion?.choices?.[0]?.message?.content;
        if (!content || /^.429/.test(content)) {
            throw new Error("Too many requests");
        }
        
        return content;
    } catch (error) {
        console.error("Error in fetching response: ", error);
        return Promise.reject(error);
    }
}

// test
// conversation("Hello, world!").then(response => console.log(response));
  
  