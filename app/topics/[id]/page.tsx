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
    const [showReflection, setShowReflection] = useState(false);
    const [reflectionAnswer, setReflectionAnswer] = useState('');
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [reflectionComment, setReflectionComment] = useState('');
    const [displayedReflectionComment, setDisplayedReflectionComment] = useState('');
    const [isReflectionTyping, setIsReflectionTyping] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
                    setShowReflection(true);
                }
            }, 50);
        } catch (error) {
            console.error('Error generating final comment:', error);
            setFinalComment('コメントの生成に失敗しました。');
            setDisplayedComment('コメントの生成に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReflectionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reflectionAnswer.trim()) return;

        try {
            setIsLoading(true);
            const response = await fetch('/api/generate-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answer: reflectionAnswer,
                    question: "この学びを通して、あなたは何を学びましたか？"
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate reflection comment');
            }

            const data = await response.json();
            const newReflectionComment = data.comment;
            setReflectionComment(newReflectionComment);
            setDisplayedReflectionComment(''); // 初期化

            // タイプライターアニメーションを開始
            setIsReflectionTyping(true);
            let currentText = newReflectionComment;
            const interval = setInterval(() => {
                if (currentText.length > 0) {
                    setDisplayedReflectionComment(prev => prev + currentText[0]);
                    currentText = currentText.slice(1);
                } else {
                    clearInterval(interval);
                    setIsReflectionTyping(false);
                    setIsSessionComplete(true);
                    setShowCelebration(true);
                }
            }, 50);
        } catch (error) {
            console.error('Error:', error);
            alert('コメントの生成に失敗しました。もう一度お試しください。');
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
            <div className="max-w-5xl mx-auto px-2 py-2">
                <div className="flex gap-2">
                    {/* タイムライン */}
                    <div className="hidden md:block w-20 flex-shrink-0 mt-10 mr-7">
                        <div className="sticky top-8">
                            <div className="space-y-6">
                                <div className={`flex items-center ${currentQuestionIndex === 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentQuestionIndex === 0 ? 'bg-blue-100 ring-2 ring-blue-200' : 'bg-slate-100'}`}>
                                        <span className="text-xs font-medium">1</span>
                                    </div>
                                    <span className="ml-1 text-xs font-medium tracking-wide">質問1</span>
                                </div>
                                <div className="h-16 w-0.5 bg-gradient-to-b from-blue-200 to-slate-200 ml-2.5"></div>
                                <div className={`flex items-center ${currentQuestionIndex === 1 ? 'text-blue-600' : 'text-slate-400'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentQuestionIndex === 1 ? 'bg-blue-100 ring-2 ring-blue-200' : 'bg-slate-100'}`}>
                                        <span className="text-xs font-medium">2</span>
                                    </div>
                                    <span className="ml-1 text-xs font-medium tracking-wide">質問2</span>
                                </div>
                                <div className="h-16 w-0.5 bg-gradient-to-b from-blue-200 to-slate-200 ml-2.5"></div>
                                <div className={`flex items-center ${currentQuestionIndex === 2 ? 'text-blue-600' : 'text-slate-400'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${currentQuestionIndex === 2 ? 'bg-blue-100 ring-2 ring-blue-200' : 'bg-slate-100'}`}>
                                        <span className="text-xs font-medium">3</span>
                                    </div>
                                    <span className="ml-1 text-xs font-medium tracking-wide">質問3</span>
                                </div>
                                <div className="h-16 w-0.5 bg-gradient-to-b from-blue-200 to-slate-200 ml-2.5"></div>
                                <div className={`flex items-center ${showReflection && !isSessionComplete ? 'text-blue-600' : 'text-slate-400'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${showReflection && !isSessionComplete ? 'bg-blue-100 ring-2 ring-blue-200' : 'bg-slate-100'}`}>
                                        <span className="text-xs font-medium">4</span>
                                    </div>
                                    <span className="ml-1 text-xs font-medium tracking-wide">聖書</span>
                                </div>
                                <div className="h-16 w-0.5 bg-gradient-to-b from-blue-200 to-slate-200 ml-2.5"></div>
                                <div className={`flex items-center ${isSessionComplete ? 'text-blue-600' : 'text-slate-400'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isSessionComplete ? 'bg-blue-100 ring-2 ring-blue-200' : 'bg-slate-100'}`}>
                                        <span className="text-xs font-medium">5</span>
                                    </div>
                                    <span className="ml-1 text-xs font-medium tracking-wide">振り返り</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* メインコンテンツ */}
                    <div className="flex-1 max-w-4xl">
                        <div className="bg-white rounded-xl p-2 border border-slate-100 shadow-sm">
                            {/* ヘッダー */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mb-5"
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <Link
                                        href="/"
                                        className="inline-flex items-center px-4 py-1 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        トピック一覧に戻る
                                    </Link>
                                </div>
                                <h1 className="text-4xl font-bold text-slate-800 mb-2">{topic.title}</h1>
                                <p className="text-md text-slate-600 mt-2">{topic.description} あなたの考えを教えてください。</p>
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
                                        className="bg-white rounded-2xl shadow-lg p-2"
                                    >
                                        <div className="space-y-6">
                                            {/* これまでの回答 */}
                                            {answers.map((answer, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col"
                                                >
                                                    <div className="flex items-center mb-4">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                                            <span className="text-blue-600 font-semibold">{index + 1}</span>
                                                        </div>
                                                        <h3 className="text-lg font-medium text-slate-800">{topic.questions[index]}</h3>
                                                    </div>
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
                                                                <h4 className="text-sm font-medium text-blue-600">AI牧師のコメント</h4>
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
                                                        <h3 className="text-lg font-medium text-slate-800">{topic.questions[currentStep]}</h3>
                                                    </div>
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
                                            className="bg-white rounded-2xl shadow-lg p-3"
                                        >
                                            <div className="text-center mb-8">
                                                <h2 className="text-2xl font-semibold text-slate-800 mb-2">聖書の教え</h2>
                                                <p className="text-slate-600">あなたの学びを深める聖書の言葉</p>
                                            </div>

                                            <div className="relative">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 shadow-lg flex flex-col"
                                                    style={{ height: 'auto' }}
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

                                            {isLoading && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="flex items-center justify-center space-x-2 mt-4"
                                                >
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </motion.div>
                                            )}

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

                            {showReflection && !isSessionComplete && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8"
                                >
                                    <form onSubmit={handleReflectionSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="reflection" className="block text-sm font-medium text-slate-700 mb-2">
                                                この学びを通して、あなたは何を学びましたか？
                                            </label>
                                            <textarea
                                                id="reflection"
                                                value={reflectionAnswer}
                                                onChange={(e) => setReflectionAnswer(e.target.value)}
                                                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                                                rows={4}
                                                placeholder="あなたの学びを共有してください..."
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isLoading || !reflectionAnswer.trim()}
                                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? '回答中...' : '学びを共有する'}
                                        </button>
                                    </form>
                                </motion.div>
                            )}

                            {reflectionAnswer && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8 space-y-6"
                                >
                                    <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                                            <div className="flex items-center mb-4">
                                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <h4 className="text-base font-medium text-blue-600">あなたの学び</h4>
                                            </div>
                                            <p className="text-slate-700 text-sm whitespace-pre-wrap">
                                                {reflectionAnswer}
                                            </p>
                                        </div>
                                    </div>

                                    {reflectionComment && (
                                        <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                                            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-purple-100">
                                                <div className="flex items-center mb-4">
                                                    <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                    </svg>
                                                    <h4 className="text-base font-medium text-purple-600">AI牧師からの励まし</h4>
                                                </div>
                                                <p className="text-slate-700 text-sm whitespace-pre-wrap">
                                                    {displayedReflectionComment}
                                                    {isReflectionTyping && (
                                                        <span className="inline-block w-2 h-4 ml-1 bg-purple-600 animate-pulse" />
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {showCelebration && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-8 text-center"
                                >
                                    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                                        <motion.div
                                            animate={{
                                                y: [0, -10, 0],
                                                rotate: [0, 5, -5, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                repeatType: "reverse"
                                            }}
                                            className="text-4xl mb-4"
                                        >
                                            🎉
                                        </motion.div>
                                        <h3 className="text-xl font-bold text-green-600 mb-2">おめでとうございます！</h3>
                                        <p className="text-slate-600">
                                            この学びのセッションは終了です。<br />
                                            神の祝福があなたと共にありますように。
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 