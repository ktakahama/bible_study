import Link from 'next/link'
import fs from 'fs'
import path from 'path'

export async function getStaticProps() {
  const filePath = path.join(process.cwd(), 'data', 'topics.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { props: { topics: data.topics } };
}

export default function TopicsPage({ topics }) {
  return (
    <div>
      <h1>Topics</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <Link href={`/topics/${topic.id}`}>{topic.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
