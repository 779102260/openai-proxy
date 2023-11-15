import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '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', // defaults to process.env["OPENAI_API_KEY"]
})

/** openai 对话接口 */
export async function conversation(prompt: string) {
    try {
        // const chatCompletion: any = await axios.post('https://api.openai.com/v1/chat/completions', {
        //     model: 'gpt-3.5-turbo',
        //     messages: [{
        //         role: 'user',
        //         content: prompt
        //     }]
        // }, {
        //     headers: { 
        //         'Content-Type': 'application/json', 
        //         'Authorization': `Bearer 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` 
        //     },
        //     proxy: {
        //         host: '127.0.0.1',
        //         port: 7890
        //     }
        // });
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

conversation("Hello, world!").then(response => console.log(response));
  
  