import { Configuration, OpenAIApi } from 'openai'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  const { topic } = req.body
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY })
  const openai = new OpenAIApi(configuration)
  const prompt = `次のテーマ「${topic}」について、ディスカッション用の深掘り質問を3つ日本語で作成してください。ノンクリスチャンにも理解しやすい表現で。`
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }]
    })
    const text = completion.data.choices[0].message.content
    const questions = text.split('\n').filter(Boolean)
    res.status(200).json({ questions })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to generate questions' })
  }
}
