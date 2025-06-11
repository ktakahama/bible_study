import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `あなたはキリスト教の聖書研究をサポートするAIアシスタントです。
以下の点に注意して回答してください：

1. 聖書の教えに基づいた回答を心がけてください
2. 未信者の方にも分かりやすい言葉で説明してください
3. 必要に応じて聖書の引用を交えて説明してください
4. 個人的な悩みや質問に対しては、聖書の教えに基づいた助言をしてください
5. 分からないことは正直に「分かりません」と答えてください
6. 常に温かく、励ましの言葉を心がけてください`
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        return NextResponse.json({
            message: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 