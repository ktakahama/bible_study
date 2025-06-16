import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { answer, question } = await request.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `あなたはユーザーの回答に対して励ましのメッセージを送る牧師です。
以下の点に注意して回答してください：

1. ユーザーの回答を尊重し、共感を示す
2. 簡潔で分かりやすい表現を使用する
3. 否定的な表現を避け、前向きな言葉を選ぶ
4. 直接的な聖書の引用は避ける
5. 回答は200文字程度に収める`
                },
                {
                    role: "user",
                    content: `質問: ${question}\n\n回答: ${answer}\n\n上記の回答に対して、聖書の教えに基づいた励ましのメッセージを送ってください。`
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const comment = completion.choices[0].message.content;

        return NextResponse.json({ comment });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'コメントの生成に失敗しました' },
            { status: 500 }
        );
    }
} 