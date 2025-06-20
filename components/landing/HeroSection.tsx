'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { kosenList } from "@/lib/kosen-data"


const heroImages = kosenList
  .filter((kosen) => kosen.imageUrl && kosen.imageCreditText)
  .map((kosen) => {
    const creditParts = kosen.imageCreditText!.split(", ")
    const photographer = creditParts[0]
    const license = creditParts[1] || ""

    return {
      src: kosen.imageUrl!,
      alt: `${kosen.name}の風景`,
      photographer: photographer,
      license: license,
      licenseUrl: kosen.imageCreditUrl,
    }
  })

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set())
  
  const shuffledImages = useMemo(() => {
    // サーバーとクライアントで同じ結果を得るため、固定のシード値を使用
    const seedDate = new Date('2024-01-01').getTime()
    let seed = seedDate
    
    // シンプルな疑似乱数ジェネレーター（Linear Congruential Generator）
    const seededRandom = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff
      return seed / 0x7fffffff
    }
    
    const shuffled = [...heroImages]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  // 画像のプリロード関数
  const preloadImage = (src: string) => {
    if (!preloadedImages.has(src)) {
      const img = new window.Image()
      img.src = src
      img.onload = () => {
        setPreloadedImages(prev => new Set(prev).add(src))
      }
    }
  }

  // 次の画像をプリロード
  useEffect(() => {
    if (shuffledImages.length > 1) {
      const nextIndex = (currentImageIndex + 1) % shuffledImages.length
      const nextImage = shuffledImages[nextIndex]
      if (nextImage) {
        preloadImage(nextImage.src)
      }
    }
  }, [currentImageIndex, shuffledImages])

  // 初期時に最初の3つの画像をプリロード
  useEffect(() => {
    const imagesToPreload = shuffledImages.slice(0, Math.min(3, shuffledImages.length))
    imagesToPreload.forEach(image => preloadImage(image.src))
  }, [shuffledImages])

  // 初期画像の読み込み完了後に画像切り替えを開始
  useEffect(() => {
    if (shuffledImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % shuffledImages.length)
      }, 7000) // 7秒ごとに画像を切り替え

      return () => clearInterval(interval)
    }
  }, [shuffledImages.length])

  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  } as const

  const currentImage = shuffledImages[currentImageIndex]

  if (!currentImage) {
    // 画像がない場合のフォールバック（何も表示しないか、代替コンテンツを表示）
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className="relative w-full h-screen flex items-center justify-center text-center text-white overflow-hidden"
    >
      <AnimatePresence>
        <motion.div
          key={currentImage.src}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <Image
            src={currentImage.src}
            alt={currentImage.alt}
            layout="fill"
            objectFit="cover"
            priority={currentImageIndex < 3}
            {...(currentImageIndex >= 3 && {
              loading: preloadedImages.has(currentImage.src) ? "eager" : "lazy"
            })}
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-black/60 z-10" />
      <div className="relative z-20 container px-4 md:px-6">
        <motion.h1
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl/none text-shadow-lg"
        >
          あなたに<span className='text-cyan-400'>最適</span>な高専を<span className='text-pink-500'>見つけよう</span>
        </motion.h1>
        <motion.p
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="max-w-[700px] mx-auto text-gray-200 md:text-xl my-6 text-shadow"
        >
          興味・適性・地域から、あなたにぴったりの高等専門学校をマッチング。未来のエンジニアへの第一歩を踏み出しましょう。
        </motion.p>
        <motion.div
          variants={FADE_UP_ANIMATION_VARIANTS}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 shadow-lg"
            asChild
            size="lg"
          >
            <Link href="/diagnosis" className="flex items-center gap-2">
              <span>診断を始める</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg"
            asChild
          >
            <Link href="/find-kosen">高専一覧を見る</Link>
          </Button>
        </motion.div>
      </div>
      {currentImage.photographer && (
        <div className="absolute bottom-4 right-4 z-20 text-xs text-white/70">
          <span>{currentImage.photographer}</span>
          {currentImage.license && (
            <>
              {" / "}
              {currentImage.licenseUrl ? (
                <a
                  href={currentImage.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {currentImage.license}
                </a>
              ) : (
                <span>{currentImage.license}</span>
              )}
            </>
          )}
        </div>
      )}
    </motion.section>
  )
} 