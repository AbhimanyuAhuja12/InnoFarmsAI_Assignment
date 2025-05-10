"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "../../lib/utils"

const Slider = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  // Calculate the highlight width based on the current value
  const calculateHighlightWidth = () => {
    if (!value || !Array.isArray(value)) return "0%"

    const min = props.min || 0
    const max = props.max || 100
    const range = max - min

    if (value.length === 1) {
      // Single thumb slider
      return `${((value[0] - min) / range) * 100}%`
    } else if (value.length === 2) {
      // Range slider
      return `${((value[1] - value[0]) / range) * 100}%`
    }

    return "0%"
  }

  const highlightWidth = calculateHighlightWidth()
  const highlightLeft =
    value && Array.isArray(value) && value.length === 2
      ? `${((value[0] - (props.min || 0)) / ((props.max || 100) - (props.min || 0))) * 100}%`
      : "0%"

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <SliderPrimitive.Track className="slider-track">
        <div
          className="slider-track-highlight"
          style={{
            "--highlight-width": highlightWidth,
            left: highlightLeft,
          }}
        />
        <SliderPrimitive.Range className="absolute h-full bg-transparent" />
      </SliderPrimitive.Track>
      {value &&
        Array.isArray(value) &&
        value.map((_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            className="slider-thumb focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        ))}
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
