import { url } from '@/libs/utils/url'
import { openaiToClaudeRequest } from "./conversions";
import { createConversation } from "./conversation";

const ORG_ID = process.env.ORG_ID;
const SESSION_KEY = process.env.SESSION_KEY;

export async function conversation(messages: Message[], orgId = ORG_ID, sessionKey = SESSION_KEY, conversationId?: string, stream = false) {
    if ( !messages || messages.length < 1 || !orgId || !sessionKey) {
        throw new Error('参数错误');
    }
    if (!conversationId) {
        await createConversation(orgId, sessionKey);
    }
    const init: RequestInit = openaiToClaudeRequest(messages, orgId, conversationId);
    const response = await fetch(url('/api/claude/append_message', request), init);

    if (!response.ok) {
        return new Response(response.body, { status: 400 })
    }

    const result = stream ? await claude.iteratorToStream(response) : await claude.readerStream(response);
}

interface Message {
    role: string,
    content: string,
    name?: string,
    function_call?: object,
}