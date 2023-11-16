import { NextRequest, NextResponse } from "next/server";
import { conversation as openaiConversation } from "@/libs/openai/ask";
import { conversation as azureConversation } from "@/libs/azure/ask";


// 映射
const map = new Map([ ['openaiConversation', openaiConversation], [ 'azureConversation', azureConversation ] ]);


/**
 * 这个 API 用于ai对话，将所有模型封装统一，如果使用某个模型对话失败，会自动使用下一个模型
 * @param request
 * @returns
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { prompt: string } }
) {
  try {
    const { prompt } = params;
    if (!prompt) {
      throw new Error("Prompt is required");
    }
    // 对话
    const response = await openaiConversation(prompt).catch((error) => {
      console.error("openai对话错误: ", error);
      return azureConversation(prompt)
    }).catch((error) => {
      console.error("azure对话错误: ", error);
    })
    return NextResponse.json({
      code: 0,
      data: response,
      msg: "Post request handled successfully",
    });
  } catch (error) {
    return NextResponse.json({ code: -1, data: null, msg: error?.message });
  }
}
