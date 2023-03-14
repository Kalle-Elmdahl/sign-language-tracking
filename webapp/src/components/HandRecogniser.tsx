import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import Hand, { refHand } from "../util/Hand"

interface HandRecogniserProps {
	video: HTMLVideoElement
	hands: Hand[]
}

export default function HandRecogniser({ video, hands }: HandRecogniserProps) {
	const canvas = useRef<HTMLCanvasElement>(null)
	const context = useMemo(() => {
		if (canvas.current === null) return
		const context = canvas.current.getContext("2d")

		if (context == null) return

		return context
	}, [canvas.current])

	useLayoutEffect(() => {
		if (!canvas.current || !context) return
		console.log(hands.at(0))

		const canvasWidth = canvas.current.width
		const canvasHeight = canvas.current.height
		context.clearRect(0, 0, canvasWidth, canvasHeight)
		context.scale(-1, 1)
		context.translate(-canvasWidth, 0)
		context.drawImage(video, 0, 0, 1280, 720, 0, 0, canvasWidth, canvasHeight)
		context.lineCap = "round"
		context.strokeStyle = "white"
		context.fillStyle = "yellow"
		const drawOptions = {
			scaleX: canvasWidth,
			scaleY: canvasHeight,
		}
        
		context.strokeStyle = "#5EBB45"
		hands.forEach(hand => hand.drawHand(context, drawOptions))

		context.setTransform(1, 0, 0, 1, 0, 0)
	}, [hands])

	useEffect(() => {
		const handleResize = () => {
			if (!canvas.current) return
			canvas.current.width = window.innerWidth
			canvas.current.height = (window.innerWidth * 9) / 16
		}
		window.addEventListener("resize", handleResize)
		handleResize()
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	return (
		<div>
			<canvas ref={canvas} />
		</div>
	)
}
