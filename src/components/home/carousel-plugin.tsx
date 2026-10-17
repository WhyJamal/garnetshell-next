"use client"

import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Pause, Play } from "lucide-react"
import Image from "next/image"

type CarouselPluginProps = {
  isPlaying: boolean
  onToggle: () => void
}

export function CarouselPlugin({ isPlaying, onToggle }: CarouselPluginProps) {
  const [api, setApi] = React.useState<any>(null)

  React.useEffect(() => {
    if (!api || !isPlaying) return
    const interval = setInterval(() => {
      api.scrollNext()
    }, 1200)
    return () => clearInterval(interval)
  }, [api, isPlaying])

  const items = [
    { title: "Совещание команды", genre: "Офис", image: "/images/stock-teamwork-with-laptops.webp" },
    { title: "Склад", genre: "Логистика", image: "/images/stock-warehause.webp" },
    { title: "Аналитика", genre: "Аналитика", image: "/images/stock-analitic.webp" },
    { title: "Корпорация", genre: "Корпорация", image: "/images/stock-corporation.webp" },
  ]

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "start", dragFree: true }}
        className="w-full px-4 border-b"
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem
              key={index}
              className="basis-full sm:basis-1/3"
            >
              <div className="group overflow-hidden transition">

                <div className="relative h-62.5 w-full rounded-md overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="700px"
                    className="object-cover transition"
                  />
                </div>

                <div className="px-3 py-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {item.genre}
                  </p>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex sm:hidden justify-start mt-4 pl-5">
        <button
          onClick={onToggle}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-black dark:border-white dark:text-white"
        >
          {isPlaying ? (
            <Pause className="h-3 w-3 fill-black dark:fill-white" />
          ) : (
            <Play className="h-3 w-3 translate-x-0.5 fill-black dark:fill-white" />
          )}
        </button>
      </div>
    </div>
  )
}