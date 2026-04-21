"use client"

import Image from 'next/image';
import React, { useState, useRef } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

interface FacebookCardProps {
    image?: string;
    profileImage: string;
    content: string | React.ReactNode;
    username: string;
    timestamp: string;
    className?: string;
}

const FacebookCard = (props: FacebookCardProps) => {
    const [isLiked, setIsLiked] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const likeRef = useRef<SVGSVGElement>(null);

    const { contextSafe } = useGSAP({ scope: containerRef });

    // eslint-disable-next-line react-hooks/refs
    const animateIcon = contextSafe((iconRef: React.RefObject<SVGSVGElement | null>) => {
        if (iconRef.current) {
            gsap.fromTo(iconRef.current, 
                { scale: 1 },
                { 
                    scale: 1.2,
                    duration: 0.1,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(iconRef.current, {
                            scale: 1,
                            duration: 0.15,
                            ease: "power2.out"
                        });
                    }
                }
            );
        }
    });

    const handleLikeClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);
        if (newLikedState) {
            animateIcon(likeRef);
        }
    };

    return (
        <div 
            ref={containerRef}
            className={cn("w-full max-w-xl flex flex-col rounded-2xl border border-white/10", props.className)} 
            style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
                backgroundColor: "#252728"
            }}
        >
            {/* Header */}
            <div className="flex items-center gap-2 p-3">
                <Image
                    src={props.profileImage}
                    alt={props.username}
                    className="w-10 h-10 rounded-full object-cover"
                    width={40}
                    height={40}
                />
                <div className="flex flex-col">
                    <span className="font-semibold text-white text-sm hover:underline cursor-pointer">
                        {props.username}
                    </span>
                    <span className="text-xs" style={{ color: "#B0B3B8" }}>
                        {props.timestamp}
                    </span>
                </div>
            </div>

            {/* Content */}
            {typeof props.content === 'string' ? (
                <>
                    <div className="px-3 pb-3 text-white whitespace-pre-wrap wrap-break-word text-sm">
                        {props.content}
                    </div>
                    {props.image && (
                        <div className="w-full overflow-hidden">
                            <Image 
                                src={props.image} 
                                alt={props.username} 
                                className="w-full h-auto object-cover" 
                                width={600} 
                                height={400} 
                            />
                        </div>
                    )}
                </>
            ) : (
                <div className="w-full overflow-hidden">
                    {props.content}
                </div>
            )}

            {/* Actions */}
            <div className="w-full border-t border-white/10 px-3 py-1 flex items-center justify-around">
                {/* Like */}
                <button
                    onClick={handleLikeClick}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors cursor-pointer hover:bg-[#404142]"
                    style={{ color: isLiked ? '#1877F2' : '#B0B3B8' }}
                    type="button"
                >
                    <svg
                        ref={likeRef}
                        viewBox="0 0 24 24"
                        className="w-[18px] h-[18px]"
                        fill="none"
                        style={{ transformOrigin: 'center center' }}
                    >
                        {isLiked ? (
                            <path d="M6 22H4C3.46957 22 2.96101 21.7891 2.58594 21.4141C2.21089 21.039 2 20.5304 2 20V12C2.00002 11.4696 2.21088 10.961 2.58594 10.5859C2.96101 10.2109 3.46959 10 4 10H6V22ZM12 2C12.4715 2.00584 12.9354 2.11872 13.3574 2.3291C13.7794 2.53949 14.149 2.84185 14.4375 3.21484C14.726 3.58794 14.926 4.02196 15.0234 4.4834C15.1208 4.94476 15.113 5.42209 15 5.87988L14 10H19.8301C20.1405 10 20.4469 10.0721 20.7246 10.2109C21.0022 10.3497 21.2434 10.5516 21.4297 10.7998C21.616 11.0482 21.7423 11.3371 21.7979 11.6426C21.8533 11.948 21.8369 12.2626 21.75 12.5605L19.4199 20.5605C19.2987 20.9756 19.0461 21.3401 18.7002 21.5996C18.354 21.8593 17.9327 22 17.5 22H8V9.56641C8.22988 9.38426 8.41846 9.15398 8.5498 8.88965L12 2Z" fill="#1877F2"/>
                        ) : (
                            <>
                                <path d="M15 5.88L14 10H19.83C20.1405 10 20.4467 10.0723 20.7244 10.2111C21.0021 10.35 21.2437 10.5516 21.43 10.8C21.6163 11.0484 21.7422 11.3367 21.7977 11.6422C21.8533 11.9477 21.8369 12.2619 21.75 12.56L19.42 20.56C19.2988 20.9754 19.0462 21.3404 18.7 21.6C18.3538 21.8596 17.9327 22 17.5 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V12C2 11.4696 2.21071 10.9609 2.58579 10.5858C2.96086 10.2107 3.46957 10 4 10H6.76C7.13208 9.9998 7.49674 9.89581 7.81296 9.69972C8.12917 9.50363 8.38442 9.22321 8.55 8.89L12 2C12.4716 2.00584 12.9357 2.11817 13.3578 2.3286C13.7799 2.53902 14.1489 2.84211 14.4374 3.2152C14.7259 3.5883 14.9263 4.02176 15.0237 4.4832C15.1212 4.94464 15.113 5.42213 15 5.88Z" stroke="#B0B3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 10V22" stroke="#B0B3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </>
                        )}
                    </svg>
                    <span className="text-sm font-semibold">Like</span>
                </button>

                {/* Comment */}
                <button 
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors cursor-pointer hover:bg-[#404142]"
                    style={{ color: '#B0B3B8' }}
                    type="button"
                >
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                    </svg>
                    <span className="text-sm font-semibold">Comment</span>
                </button>

                {/* Share */}
                <button 
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md transition-colors cursor-pointer hover:bg-[#404142]"
                    style={{ color: '#B0B3B8' }}
                    type="button"
                >
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/>
                        <path d="m21.854 2.147-10.94 10.939"/>
                    </svg>
                    <span className="text-sm font-semibold">Share</span>
                </button>
            </div>
        </div>
    )
}

export default FacebookCard

