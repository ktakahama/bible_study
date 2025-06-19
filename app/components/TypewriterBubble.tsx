"use client";
import { useEffect, useState } from "react";

interface TypewriterBubbleProps {
    text: string;
    icon?: React.ReactNode;
    className?: string;
    bubbleClassName?: string;
}

export default function TypewriterBubble({ text, icon = <span className='mr-6 mt-[-5] text-2xl'>🧑‍🦳</span>, className = '', bubbleClassName = '' }: TypewriterBubbleProps) {
    const [displayed, setDisplayed] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    useEffect(() => {
        setDisplayed("");
        setIsTyping(true);
        let currentText = "";
        const interval = setInterval(() => {
            if (currentText.length < text.length) {
                currentText = text.slice(0, currentText.length + 1);
                setDisplayed(currentText);
            } else {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [text]);
    return (
        <div className={`w-full max-w-4xl mx-auto mt-8 flex items-center justify-center ${className}`}>
            {icon}
            <div className="relative max-w-[80%]">
                <div className={`bg-blue-50 rounded-xl px-4 py-2 text-blue-900 shadow-sm border border-blue-100/60 whitespace-pre-line ${bubbleClassName}`}>
                    {displayed ? displayed : "テキストが表示されていません。"}
                    {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-blue-600 animate-pulse align-middle" />}
                </div>
                {/* 左外側に鋭角が向く三角 */}
                <div className="absolute -left-4 top-3">
                    <svg width="16" height="24" viewBox="0 0 16 24"><polygon points="0,12 16,0 16,24" fill="#EFF6FF" stroke="#DBEAFE" strokeWidth="1" /></svg>
                </div>
            </div>
        </div>
    );
} 