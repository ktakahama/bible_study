import { useState } from 'react'
import { useRouter } from 'next/router'
import fs from 'fs'
import path from 'path'

export async function getStaticPaths() {
  const filePath = path.join(process.cwd(), 'data', 'topics.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const paths = data.topics.map((t) => ({ params: { id: t.id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const topicsPath = path.join(process.cwd(), 'data', 'topics.json');
  const topicsData = JSON.parse(fs.readFileSync(topicsPath, 'utf8'));
  const topic = topicsData.topics.find((t) => t.id === params.id);

  const versesPath = path.join(process.cwd(), 'data', 'bible-verses.json');
  const versesData = JSON.parse(fs.readFileSync(versesPath, 'utf8'));
  const verses = versesData[topic.name] || [];

  return { props: { topic, verses } };
}

export default function TopicDetail({ topic, verses }) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: topic.name })
    });
    const data = await res.json();
    setQuestions(data.questions || []);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => router.back()}>&lt; Back</button>
      <h1>{topic.name}</h1>
      <div>
        <label>
          Why did you choose this topic?
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </label>
        <button onClick={generateQuestions} disabled={loading}>
          {loading ? 'Loading...' : 'Generate Questions'}
        </button>
      </div>
      {questions.length > 0 && (
        <div>
          <h2>Questions</h2>
          <ol>
            {questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ol>
        </div>
      )}
      {verses.length > 0 && (
        <div>
          <h2>Bible Verses</h2>
          <ul>
            {verses.map((v, i) => (
              <li key={i}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
