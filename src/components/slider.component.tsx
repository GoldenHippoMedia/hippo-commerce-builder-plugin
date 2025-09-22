import React, { useState, useCallback } from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'

export interface SlideItem {
  url: string
  altText: string
}

interface SliderProps {
  items: SlideItem[]
  className?: string
  imageClassName?: string
  showDots?: boolean
  showArrows?: boolean
  autoPlay?: boolean
  autoPlayInterval?: number
  onSlideChange?: (currentIndex: number) => void
}

const Slider: React.FC<SliderProps> = ({
  items,
  className = '',
  imageClassName = '',
  showDots = true,
  showArrows = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  onSlideChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle empty or single item arrays
  if (!items || items.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-base-200 rounded-lg h-64 ${className}`}>
        <div className="text-base-content/60 text-sm">No images available</div>
      </div>
    )
  }

  if (items.length === 1) {
    return (
      <div className={`relative rounded-lg overflow-hidden aspect-square ${className} mx-auto`}>
        <img src={items[0].url} alt={items[0].altText} className={`object-cover w-full h-full ${imageClassName}`} />
      </div>
    )
  }

  const goToSlide = useCallback(
    (index: number) => {
      const newIndex = Math.max(0, Math.min(index, items.length - 1))
      setCurrentIndex(newIndex)
      onSlideChange?.(newIndex)
    },
    [items.length, onSlideChange],
  )

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }, [currentIndex, items.length, goToSlide])

  const goToNext = useCallback(() => {
    const newIndex = currentIndex === items.length - 1 ? 0 : currentIndex + 1
    goToSlide(newIndex)
  }, [currentIndex, items.length, goToSlide])

  React.useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, goToNext])

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToPrevious, goToNext])

  return (
    <div
      className={`relative rounded-lg aspect-square overflow-hidden group ${className} mx-auto`}
      style={{ minHeight: '200px', maxHeight: '600px' }}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full aspect-square">
        <img
          src={items[currentIndex].url}
          alt={items[currentIndex].altText}
          className={`w-full h-full object-cover ease-in-out transition-opacity duration-300 ${imageClassName}`}
          draggable={false}
          onLoad={() => {
            // Ensure the layout is stable after the image loads
          }}
        />
      </div>

      {/* Navigation Arrows */}
      {showArrows && items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
            aria-label="Previous image"
          >
            <HiChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              goToNext()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/50 z-10"
            aria-label="Next image"
          >
            <HiChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                goToSlide(index)
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentIndex
                  ? 'bg-white scale-110 shadow-lg'
                  : 'bg-white/60 hover:bg-white/80 hover:scale-105'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {items.length > 1 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {items.length}
        </div>
      )}
    </div>
  )
}

export default Slider
