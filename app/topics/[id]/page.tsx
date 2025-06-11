'use client';

import AIChat from '@/app/components/AIChat';
import { categories } from '@/data/topics';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface BibleReference {
    book: string;
    chapter: number;
    verse: string;
    text: string;
}

interface Topic {
    id: string;
    title: string;
    description: string;
    questions: string[];
    bibleReferences: BibleReference[];
}

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const topic = categories
        .flatMap(category => category.topics)
        .find(t => t.id === resolvedParams.id);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<{ text: string; comment: string }[]>([]);
    const [showBibleReferences, setShowBibleReferences] = useState(false);
    const [selectedVerse, setSelectedVerse] = useState<BibleReference | null>(null);
    const [finalComment, setFinalComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayedComment, setDisplayedComment] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    console.log('Debug - Topic:', topic);
    console.log('Debug - Questions:', topic?.questions);
    console.log('Debug - Current Step:', currentStep);
    console.log('Debug - Current Question Text:', topic?.questions[currentStep]);

    if (!topic) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">トピックが見つかりません</h1>
                    <Link
                        href="/"
                        className="inline-flex items-center px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
                    >
                        ホームに戻る
                    </Link>
                </div>
            </div>
        );
    }

    const handleNext = async (answer: string, comment: string) => {
        setAnswers(prev => [...prev, { text: answer, comment }]);
        if (currentStep < topic.questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowBibleReferences(true);
        }
    };

    const generateFinalComment = async () => {
        try {
            setIsLoading(true);
            // ランダムに聖書の御言葉を選択
            const randomIndex = Math.floor(Math.random() * topic.bibleReferences.length);
            const verse = topic.bibleReferences[randomIndex];
            setSelectedVerse(verse);

            const response = await fetch('/api/generate-final-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers: answers.map(a => a.text),
                    questions: topic.questions,
                    verse: verse
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate final comment');
            }

            const data = await response.json();
            setFinalComment(data.comment);
            // タイプライターアニメーションを開始
            setIsTyping(true);
            let currentText = '';
            const text = data.comment;
            const interval = setInterval(() => {
                if (currentText.length < text.length) {
                    currentText = text.slice(0, currentText.length + 1);
                    setDisplayedComment(currentText);
                } else {
                    clearInterval(interval);
                    setIsTyping(false);
                }
            }, 50); // 50ミリ秒ごとに1文字ずつ表示
        } catch (error) {
            console.error('Error generating final comment:', error);
            setFinalComment('コメントの生成に失敗しました。');
            setDisplayedComment('コメントの生成に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (showBibleReferences && !finalComment) {
            generateFinalComment();
        }
    }, [showBibleReferences]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* ヘッダー */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-between items-center mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            トピック一覧に戻る
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">{topic.title}</h1>
                    <p className="text-xl text-slate-600">{topic.description}</p>
                </motion.div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key="questions"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        {/* 質問と回答のスタック */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-lg p-8"
                        >
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-semibold text-slate-800 mb-2">あなたの学びの記録</h2>
                                <p className="text-slate-600">質問への回答と聖書からの励まし</p>
                            </div>

                            <div className="space-y-6">
                                {/* これまでの回答 */}
                                {answers.map((answer, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-blue-600 font-semibold">{index + 1}</span>
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-800">質問 {index + 1}</h3>
                                        </div>
                                        <p className="text-slate-600 mb-4 break-words whitespace-normal">{topic.questions[index]}</p>
                                        <div className="bg-slate-50 rounded-lg p-4 mb-4 overflow-y-auto">
                                            <p className="text-slate-700 whitespace-pre-wrap">{answer.text}</p>
                                        </div>
                                        {answer.comment && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 + 0.2 }}
                                                className="bg-blue-50 rounded-xl p-4"
                                            >
                                                <div className="flex items-center mb-2">
                                                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                    </svg>
                                                    <h4 className="text-sm font-medium text-blue-600">AI牧師からの励まし</h4>
                                                </div>
                                                <p className="text-slate-700 text-sm break-words">{answer.comment}</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}

                                {/* 現在の質問 */}
                                {currentStep < topic.questions.length && !showBibleReferences && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-xl border-2 border-blue-200 p-6 flex flex-col"
                                    >
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                <span className="text-blue-600 font-semibold">{currentStep + 1}</span>
                                            </div>
                                            <h3 className="text-lg font-medium text-slate-800">質問 {currentStep + 1}</h3>
                                        </div>
                                        <p className="text-slate-600 mb-4 break-words whitespace-normal">{topic.questions[currentStep]}</p>
                                        <div>
                                            <AIChat
                                                key={`question-${currentStep}`}
                                                onNext={handleNext}
                                                question={topic.questions[currentStep]}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* 聖書の教え */}
                        {showBibleReferences && selectedVerse && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-8"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-semibold text-slate-800 mb-2">聖書の教え</h2>
                                    <p className="text-slate-600">あなたの学びを深める聖書の言葉</p>
                                </div>

                                <div className="relative">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg h-[280px] flex flex-col"
                                    >
                                        <div className="flex items-center mb-6">
                                            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <h3 className="text-xl font-semibold text-slate-800">
                                                {selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verse}
                                            </h3>
                                        </div>
                                        <p className="text-lg text-slate-700 leading-relaxed overflow-y-auto">
                                            {selectedVerse.text}
                                        </p>
                                    </motion.div>
                                </div>

                                {finalComment && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-6"
                                    >
                                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                                            <div className="flex items-center mb-4">
                                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                                <h4 className="text-base font-medium text-blue-600">御言葉の背景と意味</h4>
                                            </div>
                                            <p className="text-slate-700 text-sm whitespace-pre-wrap">
                                                {displayedComment}
                                                {isTyping && (
                                                    <span className="inline-block w-2 h-4 ml-1 bg-blue-600 animate-pulse" />
                                                )}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
} 