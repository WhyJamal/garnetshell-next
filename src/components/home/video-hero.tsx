"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Play, Pause, RotateCcw } from "lucide-react"
import { CONFIG } from "@/config/app.config"

type VideoHeroProps = {
  isPlaying: boolean;
  onToggle: () => void
}

export default function VideoHero({ isPlaying, onToggle }: VideoHeroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch(() => { })
      }
    } else {
      video.pause()
    }
  }, [isPlaying])

  return (
    <section className="relative h-[85vh] sm:h-[90vh] overflow-hidden">

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        autoPlay
        loop
      >
        <source src="/videos/erp-landing-hero-v1.webm" type="video/webm" />
        <source src="/videos/erp-landing-hero-v2.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-0 flex items-end justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
        <div className="flex w-full max-w-7xl flex-col lg:flex-row items-start lg:items-end justify-between gap-6">

          <div className="max-w-xl sm:max-w-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden">
                <Image
                  src={CONFIG.appLogo}
                  alt="logo"
                  fill
                  sizes="120px"
                  className="object-contain p-1"
                />
              </div>

              <span className="text-sm font-medium text-white/80">
                ErpCloud
              </span>

              <span className="rounded-full border border-white/25 px-2.5 py-0.5 text-xs text-white/70">
                Предприятие готово
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[3.25rem] font-bold tracking-tight text-white leading-[1.1]">
              Запустите всю свою<br />бизнес из одного места.
            </h1>

            <p className="mt-4 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/50">
              ERP · CRM · Analytics · Automation
            </p>
          </div>

          <div className="flex sm:w-full w-75 lg:w-auto items-stretch sm:items-end gap-3">

            <button className="w-full sm:w-auto rounded-full bg-white px-1 sm:px-6 lg:px-7 py-1 sm:py-3 text-xs sm:text-sm font-semibold text-black hover:bg-white/90 transition">
              Начать бесплатно
            </button>

            <button className="w-full sm:w-auto rounded-full border border-white/30 bg-white/10 px-5 sm:px-6 lg:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition">
              Связаться
            </button>

          </div>

        </div>
      </div>

      <div className="hidden sm:flex absolute top-4 right-4 sm:top-auto sm:bottom-6 sm:right-6">
          <button
            onClick={onToggle}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-white backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause fill="#fff" className="h-4 w-4" />
            ) : (
              <Play fill="#fff" className="absolute left-2.5 top-3 h-4 w-4 translate-x-0.5" />
            )}
          </button>
      </div>

    </section>
  )
}