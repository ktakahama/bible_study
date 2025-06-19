'use client';

import { categories } from '@/data/topics';
import { motion } from 'framer-motion';
import Link from 'next/link';
import TypewriterBubble from './components/TypewriterBubble';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-400 relative">
            {/* 装飾的な背景要素 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-200/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-slate-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* ヒーローセクション */}
            <div className="relative min-h-[30vh] sm:min-h-[20vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden mb-[2vh] sm:mb-[1vh] py-1 md:py-24">
                {/* 背景グラデーション */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-700 via-blue-500 to-blue-300 opacity-90"></div>
                {/* 泡の装飾 */}
                <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-white/70 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-white/60 rounded-full blur-sm animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-24 right-1/4 w-3 h-3 bg-white/80 rounded-full blur animate-bounce" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute bottom-16 right-1/3 w-5 h-5 bg-white/50 rounded-full blur animate-bounce" style={{ animationDelay: '1.1s' }}></div>
                {/* 波のSVG */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                    <svg
                        viewBox="0 0 1440 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-24 md:h-32 lg:h-40"
                        preserveAspectRatio="none"
                    >
                        <path fill="#3B82F6" fillOpacity="0.3" d="M0,80 C360,160 1080,0 1440,80 L1440,120 L0,120 Z" />
                        <path fill="#2563EB" fillOpacity="0.5" d="M0,100 C400,180 1040,20 1440,100 L1440,120 L0,120 Z" />
                    </svg>
                </div>
                {/* メインコンテンツ */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-2 max-w-5xl mx-auto py-6 sm:py-0 md:py-12"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-4"
                    >
                        <h1 className="font-extrabold text-white tracking-tight drop-shadow-lg text-5xl xs:text-6xl sm:text-7xl md:text-8xl flex flex-col md:flex-row items-center justify-center gap-0 md:gap-4">
                            <span className="block md:inline text-shadow-lg">BIBLE</span>
                            <span className="block md:inline md:ml-4 mt-2 md:mt-0 text-shadow-lg">DIVE IN!</span>
                        </h1>
                    </motion.div>
                    {/* AI牧師の吹き出し（タイプライターアニメーション付き、単独表示） */}
                    <TypewriterBubble text={"こんにちは！今日はどのトピックを一緒に深掘りしましょうか？\n対話形式で私と一緒に学びましょう💡📖"} />
                </motion.div>
            </div>

            {/* AI利用に関する注意事項 */}
            <div className="bg-blue-900/20 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-3">
                    <div className="text-center">
                        <p className="text-xs sm:text-sm text-blue-200/80">
                            <span className="font-medium">このアプリケーションは一部AIを活用して作成されています。</span>
                            <span className="hidden sm:inline"> </span>
                            <span className="block sm:inline">AIによって生成されたコンテンツは、必ずしも完全な正確性を保証するものではありません。</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* メインコンテンツ */}
            <div className="container mx-auto px-4 py-5 relative">
                {/* カテゴリセクション */}
                {categories.map((category, categoryIndex) => (
                    <motion.div
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                        className="mb-16"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-2xl font-bold text-blue-100 min-w-0 drop-shadow">
                                {category.title}
                            </h2>
                            <div className="flex-1 h-px bg-blue-300/60"></div>
                        </div>

                        {/* トピックグリッド */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.topics.map((topic, index) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="h-[220px]"
                                >
                                    <Link href={`/topics/${topic.id}`}>
                                        <div className="group relative h-full">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/40 to-blue-200/30 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                            <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 hover:shadow-xl transition-all duration-300 border border-blue-100/50 h-full flex flex-col">
                                                <h3 className="text-3xl font-bold text-blue-900 mb-2">
                                                    {topic.title}
                                                </h3>
                                                {/* 聖句のみ表示 */}
                                                {topic.bibleReferences && topic.bibleReferences[0] && (
                                                    <div className="mb-2">
                                                        <p className="text-blue-700 text-sm bg-blue-50/60 rounded px-2 py-1">
                                                            {`「${topic.bibleReferences[0].text}」`}
                                                        </p>
                                                        <div className="text-blue-500 text-xs mt-1 text-right pr-1">
                                                            {`${topic.bibleReferences[0].book} ${topic.bibleReferences[0].chapter}:${topic.bibleReferences[0].verse}`}
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="flex-grow"></div>
                                                <div className="flex items-center text-blue-600 font-medium">
                                                    <span>詳しく見る</span>
                                                    <svg
                                                        className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 5l7 7-7 7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* フッター */}
            <footer className="relative bg-blue-900/95 backdrop-blur-sm text-blue-100 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="mb-4">© 2025 Bible Dive In. All rights reserved.</p>
                    <div className="text-sm text-blue-200/80 max-w-2xl mx-auto">
                        <p className="mb-2">このアプリケーションは一部AIを活用して作成されています。</p>
                        <p>AIによって生成されたコンテンツは、必ずしも完全な正確性を保証するものではありません。</p>
                        <p>聖書の解釈や理解については、各自の判断と責任においてご利用ください。</p>
                    </div>
                </div>
            </footer>
        </main>
    );
} 