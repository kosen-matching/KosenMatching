'use client'

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { likeTestimonialAction } from "@/app/actions"

export const LikeButton = ({ testimonialId, likeCount }: { testimonialId: string, likeCount: number }) => {
  const [isPending, startTransition] = useTransition()
  
  const handleClick = () => {
    startTransition(() => {
      likeTestimonialAction(testimonialId)
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-theme-primary disabled:opacity-50"
    >
      <Heart className={`w-5 h-5 ${isPending ? 'text-theme-primary' : ''}`} />
      <span>{likeCount}</span>
    </button>
  )
} 