import { NextApiRequest, NextApiResponse } from "next"
import initCycleTLS, { type CycleTLSRequestOptions, formatConversion } from '@/libs/cycletls'
import { Readable } from "stream"

// 这个 API 接口允许用户发送消息到一个指定的 Claude 聊天会话中。
// 当接收到请求时，这个文件会负责构造适当的数据格式，并将请求转发到 Claude API，以便添加用户的消息到对话中。
// 这样，它就能够实现与 Claude 聊天机器人的交互功能。

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if ("POST" === req.method) {
            await post(req, res);
        } else {
            res.status(405).json(`${req.method} not be allowed`);
        }
    } catch(err: any) {
        console.error(err);
        res.status(400).json(err.message);
    }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    const option: CycleTLSRequestOptions = {
        'headers': {
            'Accept': 'text/event-stream, text/event-stream',
            'Cookie': `sessionKey=${req.cookies.sessionKey}`,
        },
        'body': JSON.stringify(req.body),
        'timeout': 120,
    }
    const result = await appendMessage(option);

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache, no-transform');

    const stream = new Readable();
    stream.push(result);
    stream.push(null);
    stream.pipe(res);
}

async function appendMessage(option: CycleTLSRequestOptions): Promise<any> {
    const base_url: string = `${process.env.CLAUDE_BASE}/append_message`;
    const cycleTLS = await initCycleTLS()
    const response = await cycleTLS.post(base_url, option)
        .then(res => res.body)
        .then(res => formatConversion(res))
        .catch(err => {
            throw new Error(err);
        });
    cycleTLS.exit();
    return response;
}

