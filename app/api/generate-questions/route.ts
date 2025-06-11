import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { topic, previousAnswers, currentStep } = await request.json();

        const prompt = `トピック「${topic.title}」について、以下の条件で質問を生成してください：

1. 前の回答を参考に、より深い理解を促す質問を作成
2. 以下のような切り口で質問を考えてください：
   - 具体的な経験や例を求める
   - 異なる視点や立場から考える
   - 実践的な応用を促す
   - 感情や価値観に触れる
   - 将来の展望を考える
3. 質問は2-3文程度で、十分な文脈を提供する
4. 非クリスチャンにも理解しやすい表現を使用
5. ただし、複雑すぎず、答えやすい質問にする

前の回答：
${previousAnswers.join('\n')}

現在のステップ：${currentStep + 1}/3

生成する質問：`;

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "あなたは聖書の教えについて、深い理解を促す質問を生成する牧師です。ユーザーの回答を参考に、新しい視点や深い洞察を引き出す質問を作成します。"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-3.5-turbo",
            temperature: 0.8,
            max_tokens: 150,
        });

        const question = completion.choices[0].message.content?.trim() || '';

        return NextResponse.json({ question });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: '質問の生成中にエラーが発生しました。' },
            { status: 500 }
        );
    }
} 