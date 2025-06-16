'use client';

import { categories } from '@/data/topics';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 relative">
            {/* 装飾的な背景要素 */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-200/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-slate-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* ヒーローセクション */}
            <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden mb-[-23vh] mt-[-12vh]">
                <div className="absolute inset-0 bg-[url('/church-bg.jpg')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/80 to-slate-50"></div>

                {/* 装飾的な円形要素 */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-3xl animate-pulse delay-500"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-center px-4 max-w-5xl mx-auto"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-8"
                    >
                        <h1 className="text-7xl md:text-9xl font-bold text-slate-800 mb-1 tracking-tight">
                            <div className="flex flex-col items-center">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r tracking-[0.1em] from-blue-600 via-blue-500 to-blue-600">
                                    BIBLE
                                </span>
                                <span className="text-4xl md:text-5xl mt-1 font-bold tracking-[0.3em] text-blue-500/90 w-full text-center">
                                    DIVE IN!
                                </span>
                            </div>
                        </h1>
                    </motion.div>
                    {/* 
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="text-2xl md:text-3xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
                    >
                        聖書から学ぶ<br />
                        <span className="font-bold text-blue-600">生きるためのヒント</span>
                    </motion.p> */}
                </motion.div>
            </div>

            {/* メインコンテンツ */}
            <div className="container mx-auto px-4 py-16 relative">
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
                            <h2 className="text-2xl font-bold text-slate-800 min-w-0">
                                {category.title}
                            </h2>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        {/* トピックグリッド */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {category.topics.map((topic, index) => (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="h-[180px]"
                                >
                                    <Link href={`/topics/${topic.id}`}>
                                        <div className="group relative h-full">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-slate-300 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                            <div className="relative bg-white/80 backdrop-blur-sm rounded-lg p-6 hover:shadow-xl transition-all duration-300 border border-slate-100/50 h-full flex flex-col">
                                                <h3 className="text-3xl font-bold text-slate-800 mb-3">
                                                    {topic.title}
                                                </h3>
                                                <p className="text-slate-600 mb-4 text-base line-clamp-2">
                                                    {topic.description}
                                                </p>
                                                <div className="flex-grow"></div>
                                                <div className="flex items-center text-blue-700 font-medium">
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
            <footer className="relative bg-slate-900/90 backdrop-blur-sm text-slate-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p>© 2025 Bible Dive In. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
} 