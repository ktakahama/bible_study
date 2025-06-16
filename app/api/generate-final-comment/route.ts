import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { answers, questions, verse } = await request.json();

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `あなたは聖書の教えに詳しい牧師です。
以下の点に注意して回答してください：

1. 聖書の御言葉の背景や文脈を説明する
2. その御言葉が書かれた時代背景や目的を説明する
3. 御言葉の意味を現代の視点から解釈する
4. ユーザーの回答と御言葉を関連付けて励ましのメッセージを提供する
5. 簡潔で分かりやすい表現を使用する
6. 回答は400文字程度に収める`
                },
                {
                    role: "user",
                    content: `聖書の御言葉: ${verse.book} ${verse.chapter}:${verse.verse}
${verse.text}

ユーザーの回答:
${answers.map((answer: string, index: number) => `質問${index + 1}: ${questions[index]}\n回答: ${answer}`).join('\n\n')}

上記の御言葉について、背景や意味を説明し、ユーザーの回答と関連付けて励ましのメッセージを送ってください。`
                }
            ],
            temperature: 0.7,
            max_tokens: 1000,
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