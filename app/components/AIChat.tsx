'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface AIChatProps {
    onNext: (answer: string, comment: string) => void;
    key?: string;
    question: string;
}

export default function AIChat({ onNext, question }: AIChatProps) {
    const [userAnswer, setUserAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [displayedComment, setDisplayedComment] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const typeWriter = (text: string) => {
        setIsTyping(true);
        let currentText = '';
        const interval = setInterval(() => {
            if (currentText.length < text.length) {
                currentText = text.slice(0, currentText.length + 1);
                setDisplayedComment(currentText);
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 50);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswer.trim() || isLoading) return;

        try {
            setIsLoading(true);
            const response = await fetch('/api/generate-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answer: userAnswer,
                    question: question
                }),
            });

            if (!response.ok) {
                throw new Error('コメントの生成に失敗しました');
            }

            const data = await response.json();
            const comment = data.comment;

            // タイプライターアニメーションを開始
            typeWriter(comment);

            // アニメーションが完了するのを待ってから次のステップに進む
            setTimeout(() => {
                onNext(userAnswer, comment);
            }, comment.length * 50 + 500); // 文字数 * 50ms + 余裕を持って500ms
        } catch (error) {
            console.error('Error:', error);
            alert('コメントの生成に失敗しました。もう一度お試しください。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
            onSubmit={handleSubmit}
        >
            <div>
                <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="あなたの考えを入力してください..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    rows={4}
                    disabled={isLoading}
                />
            </div>

            {displayedComment && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 rounded-xl p-4"
                >
                    <div className="flex items-center mb-2">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <h4 className="text-sm font-medium text-blue-600">AI牧師のコメント</h4>
                    </div>
                    <p className="text-gray-700 text-sm break-words">
                        {displayedComment}
                        {isTyping && (
                            <span className="inline-block w-2 h-4 ml-1 bg-blue-600 animate-pulse" />
                        )}
                    </p>
                </motion.div>
            )}

            <div className="flex justify-end">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!userAnswer.trim() || isLoading}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${!userAnswer.trim() || isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {isLoading ? '回答中...' : '回答'}
                </motion.button>
            </div>
        </motion.form>
    );
} 