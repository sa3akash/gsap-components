"use client"

import Image from 'next/image';
import React, { useState, useRef, useId } from 'react'
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { cn } from '@/lib/utils';

interface InstagramCardProps {
    image?: string;
    profileImage: string;
    isVerified: boolean;
    username: string;
    timestamp: string;
    customPost?: React.ReactNode;
    className?: string;
    postClassName?: string;
}

const InstagramCard = (props: InstagramCardProps) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const heartRef = useRef<SVGSVGElement>(null);
    const uniqueId = useId().replace(/:/g, '');

    const { contextSafe } = useGSAP({ scope: containerRef });

    // eslint-disable-next-line react-hooks/refs
    const animateHeart = contextSafe(() => {
        if (heartRef.current) {
            gsap.fromTo(heartRef.current, 
                { scale: 1 },
                { 
                    scale: 1.2,
                    duration: 0.1,
                    ease: "power2.out",
                    onComplete: () => {
                        gsap.to(heartRef.current, {
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
            animateHeart();
        }
    };

    return (
        <div 
            ref={containerRef}
            className={cn("w-full max-w-xs flex flex-col gap-2.5", props.className)} 
            style={{
                fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
            }}
        >
            <div className="flex items-center gap-1.5">
                <div className="relative w-12 h-12">
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id={`gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FFCB03" />
                                <stop offset="35%" stopColor="#e6683c" />
                                <stop offset="50%" stopColor="#dc2743" />
                                <stop offset="75%" stopColor="#cc2366" />
                                <stop offset="100%" stopColor="#d300c5" />
                            </linearGradient>
                        </defs>
                        <circle
                            cx="24"
                            cy="24"
                            r="22"
                            fill="none"
                            stroke={`url(#gradient-${uniqueId})`}
                            strokeWidth="2"
                        />
                    </svg>
                    <Image
                        src={props.profileImage}
                        alt={props.username}
                        className="absolute inset-1.5 w-9 h-9 object-cover rounded-full"
                        width={36}
                        height={36}
                    />
                </div>
                <div className='text-sm font-bold flex items-center gap-0.5'>
                    {props.username}
                    {props.isVerified && (
                        <svg fill="rgb(0, 149, 246)" height="12" viewBox="0 0 40 40" width="12">
                            <path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" fillRule="evenodd"></path>
                        </svg>
                    )}
                    <span className='text-lg text-white/40 inline-block mx-0.5'>•</span>
                    <span className='text-sm text-white/40'>{props.timestamp}</span>
                </div>
            </div>
            
            {props.customPost ? (
                <div className={cn("h-full min-h-[500px] w-full border border-white/10 rounded-md overflow-hidden", props.postClassName)}>
                    {props.customPost}
                </div>
            ) : (
                <div className={cn("w-full h-fit min-h-[500px] border border-white/10 rounded-md overflow-hidden", props.postClassName)}>
                    <Image 
                        src={props.image || ''} 
                        alt={props.username} 
                        className="w-full h-full object-cover" 
                        width={500} 
                        height={500} 
                    />
                </div>
            )}
            
            <div className="flex items-center gap-3.5">
                <button
                    onClick={handleLikeClick}
                    className="cursor-pointer"
                    type="button"
                >
                    <svg
                        ref={heartRef}
                        fill={isLiked ? "#ef4444" : "currentColor"}
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        style={{ transformOrigin: 'center center' }}
                    >
                        {isLiked ? (
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        ) : (
                            <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"/>
                        )}
                    </svg>
                </button>

                <button className="cursor-pointer hover:opacity-70" type="button">
                    <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                </button>

                <button className="cursor-pointer hover:opacity-70" type="button">
                    <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                        <path d="M13.973 20.046 21.77 6.928C22.8 5.195 21.55 3 19.535 3H4.466C2.138 3 .984 5.825 2.646 7.456l4.842 4.752 1.723 7.121c.548 2.266 3.571 2.721 4.762.717Z" fill="none" stroke="currentColor" strokeLinejoin="round" strokeWidth="2"></path>
                        <line fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" x1="7.488" x2="15.515" y1="12.208" y2="7.641"></line>
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsBookmarked(!isBookmarked);
                    }}
                    className="ml-auto cursor-pointer hover:opacity-70"
                    type="button"
                >
                    <svg
                        fill={isBookmarked ? "currentColor" : "none"}
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <polygon
                            points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default InstagramCard