"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { IProductSolutionSection } from "@/types/product.types";

interface SolutionSectionProps {
    data: IProductSolutionSection;
    dark?: boolean;
}

function MediaBlock({ media }: { media: IProductSolutionSection["media"] }) {
    const [playing, setPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlay = () => {
        setPlaying(true);
        setTimeout(() => videoRef.current?.play(), 50);
    };

    return (
        <div className="relative w-full overflow-hidden rounded-2xl aspect-video bg-black shadow-2xl group">
            <Image
                src={media.src}
                alt={media.alt ?? ""}
                fill
                className={`object-cover transition-all duration-500 ${playing ? "opacity-0 scale-105" : "opacity-100"
                    }`}
                priority
            />

            {!playing && (
                <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
            )}

            {media.type === "video" && !playing && (
                <button
                    onClick={handlePlay}
                    aria-label="Воспроизвести видео"
                    className="absolute inset-0 flex items-center justify-center group/btn"
                >
                    <div
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-colors group-hover/btn:bg-white"
                    >
                        <Play className="h-6 w-6 fill-current text-gray-900 translate-x-0.5" />
                    </div>
                </button>
            )}

            {media.type === "video" && media.videoSrc && (
                <video
                    ref={videoRef}
                    src={media.videoSrc}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"
                        }`}
                    controls={playing}
                    playsInline
                />
            )}
        </div>
    );
}

export function SolutionSection({ data }: SolutionSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <section className="py-20 px-6 md:px-16 border-t">
            <div ref={ref} className="mx-auto max-w-6xl">

                <div>
                    {data.badge && (
                        <span className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium tracking-wide bg-[#EFF6FF] text-[#1D4ED8]">
                            {data.badge}
                        </span>
                    )}

                    <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-gray-100">
                        {data.title}
                    </h2>

                    {data.description && (
                        <p className="mt-3 text-base leading-relaxed text-gray-500 dark:text-gray-300">
                            {data.description}
                        </p>
                    )}
                </div>

                <div className="grid gap-10 md:grid-cols-2 md:items-start mt-3">

                    <div>
                        <MediaBlock media={data.media} />
                    </div>

                    <div>
                        <p className="mb-5 text-base font-bold leading-snug text-gray-900 dark:text-gray-300">
                            {data.listTitle}
                        </p>

                        <ul className="flex flex-col gap-4">
                            {data.items.map((it, i) => (
                                <li key={i} className="flex gap-3">
                                    <span className="mt-1.5 h-1.75 w-1.75 shrink-0 rounded-full bg-[#1D4ED8]"/>
                                    <span className="text-sm leading-relaxed text-gray-500 dark:text-gray-300">
                                        {it.text}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        {data.ctaLabel && (
                            <div className="mt-8">
                                <Link
                                    href={data.ctaHref ?? "#"}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-all text-[#1D4ED8]"
                                >
                                    {data.ctaLabel}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}