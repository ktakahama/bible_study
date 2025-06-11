import { promises as fs } from 'fs';
import Link from 'next/link';
import path from 'path';
import React from 'react';

interface Topic {
    id: string;
    title: string;
    description: string;
}

async function getTopics(): Promise<Topic[]> {
    const filePath = path.join(process.cwd(), 'data', 'topics.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.topics;
}

export default async function TopicsPage() {
    const topics = await getTopics();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">バイブルスタディトピック</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                    <Link
                        key={topic.id}
                        href={`/topics/${topic.id}`}
                        className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    >
                        <h2 className="text-xl font-semibold mb-2">{topic.title}</h2>
                        <p className="text-gray-600">{topic.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
} 