import React, { memo, useEffect, useRef, useState } from "react"
import Hand from "../util/Hand"

interface HandPreviewProps extends React.HTMLProps<HTMLCanvasElement> {
  hands: [Hand, Hand]
}

const HandPreview = memo(function HandPreview(props: HandPreviewProps) {
  const { hands, ...canvasProps } = props
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const context = canvas.current?.getContext("2d")
    if (!context || !canvas.current) return

    const rect = canvas.current.getBoundingClientRect()

    context.strokeStyle = "#5EBB45"
    context.lineCap = "round"
    context.lineWidth = 10
    context.clearRect(0, 0, rect.width, rect.height)

    hands.forEach((hand) =>
      hand.drawHand(context, {
        scaleX: rect?.width,
        scaleY: rect?.height,
      })
    )
  }, [hands, canvas.current])
  return <canvas ref={canvas} {...canvasProps} />
})

export default HandPreview
