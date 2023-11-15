import { NextRequest, NextResponse } from "next/server";
import { conversation } from "@/libs/openai/conversion";

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
    const response = await conversation(prompt);
    return NextResponse.json({
      code: 0,
      data: response,
      msg: "Post request handled successfully",
    });
  } catch (error) {
    return NextResponse.json({ code: -1, data: null, msg: error?.message });
  }
}
